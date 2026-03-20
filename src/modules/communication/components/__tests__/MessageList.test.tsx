import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import type { Message } from "../../../../types/communication";
import { MessageList } from "../MessageList";

const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-1",
    senderRole: "tenant",
    content: "Hello, I have a question about the lease.",
    createdAt: new Date("2026-03-15T10:00:00Z"),
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "user-2",
    senderRole: "manager",
    content: "Sure, how can I help?",
    createdAt: new Date("2026-03-15T10:05:00Z"),
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "user-1",
    senderRole: "tenant",
    content: "When is the renewal date?",
    createdAt: new Date("2026-03-15T10:10:00Z"),
  },
];

describe("MessageList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Element.prototype.scrollIntoView = jest.fn();
  });

  it("renders all messages", () => {
    render(
      <MessageList
        messages={mockMessages}
        currentUserId="user-1"
        isLoading={false}
      />,
    );

    expect(
      screen.getByText("Hello, I have a question about the lease."),
    ).toBeInTheDocument();
    expect(screen.getByText("Sure, how can I help?")).toBeInTheDocument();
    expect(screen.getByText("When is the renewal date?")).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading is true", () => {
    render(
      <MessageList messages={[]} currentUserId="user-1" isLoading={true} />,
    );

    expect(
      screen.queryByText("No messages yet. Start the conversation!"),
    ).not.toBeInTheDocument();
  });

  it("shows empty state when no messages", () => {
    render(
      <MessageList messages={[]} currentUserId="user-1" isLoading={false} />,
    );

    expect(
      screen.getByText("No messages yet. Start the conversation!"),
    ).toBeInTheDocument();
  });

  it("differentiates sent and received messages visually", () => {
    render(
      <MessageList
        messages={mockMessages}
        currentUserId="user-1"
        isLoading={false}
      />,
    );

    const sentMessage = screen
      .getByText("Hello, I have a question about the lease.")
      .closest("div[class*='max-w']");
    const receivedMessage = screen
      .getByText("Sure, how can I help?")
      .closest("div[class*='max-w']");

    expect(sentMessage?.className).toContain("bg-[#8B7355]");
    expect(sentMessage?.className).toContain("text-white");
    expect(receivedMessage?.className).toContain("bg-white");
  });

  it("shows sender role for received messages", () => {
    render(
      <MessageList
        messages={mockMessages}
        currentUserId="user-1"
        isLoading={false}
      />,
    );

    expect(screen.getByText("manager")).toBeInTheDocument();
  });

  it("does not show sender role for sent messages", () => {
    render(
      <MessageList
        messages={[mockMessages[0]]}
        currentUserId="user-1"
        isLoading={false}
      />,
    );

    expect(screen.queryByText("tenant")).not.toBeInTheDocument();
  });

  it("displays messages in chronological order", () => {
    render(
      <MessageList
        messages={mockMessages}
        currentUserId="user-1"
        isLoading={false}
      />,
    );

    const messageTexts = screen
      .getAllByText(
        /Hello, I have a question|Sure, how can I help|When is the renewal/,
      )
      .map((el) => el.textContent);

    expect(messageTexts).toEqual([
      "Hello, I have a question about the lease.",
      "Sure, how can I help?",
      "When is the renewal date?",
    ]);
  });
});
