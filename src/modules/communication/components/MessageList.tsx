import React, { useEffect, useRef } from "react";

import type { Message } from "../../../types/communication";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}

function formatTimestamp(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return time;
  if (diffDays === 1) return `Yesterday ${time}`;
  if (diffDays < 7) {
    return `${d.toLocaleDateString([], { weekday: "short" })} ${time}`;
  }
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#091a2b] border-t-transparent" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p
          className="text-gray-500"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => {
        const isSent = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isSent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isSent
                  ? "bg-[#091a2b] text-white rounded-br-md"
                  : "bg-[#f1f3f4] text-[#091a2b] rounded-bl-md"
              }`}
            >
              {!isSent && (
                <p
                  className="text-xs font-semibold mb-1 text-[#005163]"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {message.senderRole}
                </p>
              )}
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {message.content}
              </p>
              <p
                className={`text-[10px] mt-1 ${
                  isSent ? "text-gray-300" : "text-gray-500"
                } text-right`}
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
