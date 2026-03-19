import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { MessageInput } from "../MessageInput";

describe("MessageInput", () => {
  const mockOnSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and send button", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    expect(
      screen.getByPlaceholderText("Type a message..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("calls onSend with trimmed content when form is submitted", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "  Hello world  " } });
    fireEvent.click(screen.getByText("Send"));

    expect(mockOnSend).toHaveBeenCalledWith("Hello world");
  });

  it("clears textarea after sending", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText(
      "Type a message...",
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByText("Send"));

    expect(textarea.value).toBe("");
  });

  it("does not send empty messages", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    fireEvent.click(screen.getByText("Send"));

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("does not send whitespace-only messages", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.click(screen.getByText("Send"));

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("disables send button when isSending is true", () => {
    render(<MessageInput onSend={mockOnSend} isSending={true} />);

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(screen.getByText("Sending")).toBeInTheDocument();
  });

  it("disables textarea when disabled prop is true", () => {
    render(
      <MessageInput onSend={mockOnSend} isSending={false} disabled={true} />,
    );

    const textarea = screen.getByPlaceholderText("Type a message...");
    expect(textarea).toBeDisabled();
  });

  it("sends message on Enter key (without Shift)", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnSend).toHaveBeenCalledWith("Hello");
  });

  it("does not send on Shift+Enter", () => {
    render(<MessageInput onSend={mockOnSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(mockOnSend).not.toHaveBeenCalled();
  });
});
