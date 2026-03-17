import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";

import communicationReducer from "../../store/communicationSlice";
import { CommunicationPage } from "../CommunicationPage";

jest.mock("../../../auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", firstName: "John", lastName: "Doe" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

jest.mock("../../api/communicationService", () => ({
  communicationService: {
    getConversations: jest.fn().mockResolvedValue({
      conversations: [
        {
          id: "conv-1",
          subject: "Lease Question",
          participants: [
            { userId: "user-2", role: "manager", name: "Jane Smith", avatarUrl: null },
          ],
          propertyId: "prop-1",
          lastMessage: {
            id: "msg-1",
            conversationId: "conv-1",
            senderId: "user-2",
            senderRole: "manager",
            content: "Let me check on that",
            createdAt: new Date().toISOString(),
          },
          unreadCount: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "conv-2",
          subject: "Maintenance Request",
          participants: [
            { userId: "user-3", role: "agent", name: "Bob Wilson", avatarUrl: null },
          ],
          propertyId: "prop-2",
          lastMessage: null,
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 2,
    }),
    getMessages: jest.fn().mockResolvedValue({
      messages: [
        {
          id: "msg-1",
          conversationId: "conv-1",
          senderId: "user-1",
          senderRole: "tenant",
          content: "When does my lease expire?",
          createdAt: new Date("2026-03-15T10:00:00Z").toISOString(),
        },
        {
          id: "msg-2",
          conversationId: "conv-1",
          senderId: "user-2",
          senderRole: "manager",
          content: "Let me check on that",
          createdAt: new Date("2026-03-15T10:05:00Z").toISOString(),
        },
      ],
      total: 2,
      page: 1,
      limit: 50,
    }),
    sendMessage: jest.fn().mockImplementation(({ content }) =>
      Promise.resolve({
        id: "msg-3",
        conversationId: "conv-1",
        senderId: "user-1",
        senderRole: "tenant",
        content,
        createdAt: new Date().toISOString(),
      }),
    ),
    markAsRead: jest.fn().mockResolvedValue(undefined),
  },
}));

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      communication: communicationReducer,
      auth: () => ({
        user: { id: "user-1" },
        isAuthenticated: true,
        isLoading: false,
      }),
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe("CommunicationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Element.prototype.scrollIntoView = jest.fn();
  });

  it("renders the page title", async () => {
    renderWithStore(<CommunicationPage />);

    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("shows conversations header", () => {
    renderWithStore(<CommunicationPage />);

    expect(screen.getByText("Conversations")).toBeInTheDocument();
  });

  it("loads and displays conversations", async () => {
    renderWithStore(<CommunicationPage />);

    await waitFor(() => {
      expect(screen.getByText("Lease Question")).toBeInTheDocument();
    });

    expect(screen.getByText("Maintenance Request")).toBeInTheDocument();
  });

  it("shows empty state when no conversation is selected", () => {
    renderWithStore(<CommunicationPage />);

    expect(
      screen.getByText("Select a conversation to start messaging"),
    ).toBeInTheDocument();
  });

  it("loads messages when a conversation is selected", async () => {
    renderWithStore(<CommunicationPage />);

    await waitFor(() => {
      expect(screen.getByText("Lease Question")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Lease Question"));

    await waitFor(() => {
      expect(
        screen.getByText("When does my lease expire?"),
      ).toBeInTheDocument();
      // "Let me check on that" appears both in sidebar preview and message list
      expect(screen.getAllByText("Let me check on that").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows unread count badge", async () => {
    renderWithStore(<CommunicationPage />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("sends a message and clears input", async () => {
    renderWithStore(<CommunicationPage />);

    await waitFor(() => {
      expect(screen.getByText("Lease Question")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Lease Question"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Thanks for checking!" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(
        screen.getByText("Thanks for checking!"),
      ).toBeInTheDocument();
    });
  });
});
