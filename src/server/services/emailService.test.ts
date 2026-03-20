// Mock @sendgrid/mail before importing the module
const mockSend = jest.fn();
const mockSetApiKey = jest.fn();
jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  default: {
    setApiKey: mockSetApiKey,
    send: mockSend,
  },
}));

// Mock winston — avoid real file transports that keep the process open
const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();
jest.mock("winston", () => ({
  __esModule: true,
  default: {
    createLogger: jest.fn(() => ({
      info: mockLoggerInfo,
      error: mockLoggerError,
    })),
    format: { json: jest.fn(() => ({})) },
    transports: {
      File: jest.fn(),
      Console: jest.fn(),
    },
  },
}));

// Mock Sentry
const mockCaptureException = jest.fn();
jest.mock("@sentry/node", () => ({
  captureException: mockCaptureException,
}));

describe("emailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockResolvedValue([{ statusCode: 202, body: "" }]);
  });

  it("should send an email successfully", async () => {
    const { sendEmail } = await import("./emailService");

    await sendEmail(
      "test@example.com",
      "Test Subject",
      "Plain text body",
      "<p>HTML body</p>",
    );

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Plain text body",
        html: "<p>HTML body</p>",
        from: expect.objectContaining({
          email: expect.any(String),
          name: expect.any(String),
        }),
      }),
    );
    expect(mockLoggerInfo).toHaveBeenCalled();
  });

  it("should throw and capture exception on SendGrid failure", async () => {
    const { sendEmail } = await import("./emailService");
    const error = new Error("SendGrid API error");
    mockSend.mockRejectedValue(error);

    await expect(
      sendEmail("fail@example.com", "Fail", "text", "<p>html</p>"),
    ).rejects.toThrow("SendGrid API error");

    expect(mockCaptureException).toHaveBeenCalledWith(error);
    expect(mockLoggerError).toHaveBeenCalled();
  });

  it("should use correct from address in sent email", async () => {
    const { sendEmail } = await import("./emailService");
    await sendEmail("user@test.com", "Subject", "text", "<p>html</p>");

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.from).toEqual({
      email: expect.any(String),
      name: expect.any(String),
    });
  });
});
