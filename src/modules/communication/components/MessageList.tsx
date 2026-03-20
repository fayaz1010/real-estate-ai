import React, { useEffect, useRef } from "react";

import type { Message } from "../../../types/communication";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  typingUserNames?: string[];
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
  typingUserNames = [],
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUserNames]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#008080] border-t-transparent" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p
          className="text-[#1A1A2E]/60"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFFFF]">
      {messages.map((message) => {
        const isSent = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isSent ? "justify-end" : "justify-start"} animate-[fadeIn_0.2s_ease-out]`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                isSent
                  ? "bg-[#008080] text-white rounded-br-md"
                  : "bg-white text-[#1A1A2E] rounded-bl-md shadow-sm border border-[#C4A882]/20"
              }`}
            >
              {!isSent && (
                <p
                  className="text-xs font-semibold mb-1 text-[#A0926B]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {message.senderRole}
                </p>
              )}
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {message.content}
              </p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-xs underline ${
                        isSent
                          ? "text-white/80 hover:text-white"
                          : "text-[#008080] hover:text-[#A0926B]"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      {att.filename}
                    </a>
                  ))}
                </div>
              )}
              <p
                className={`text-[10px] mt-1 ${
                  isSent ? "text-white/60" : "text-[#1A1A2E]/40"
                } text-right`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUserNames.length > 0 && (
        <div className="flex justify-start animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm border border-[#C4A882]/20">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A0926B] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A0926B] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A0926B] animate-bounce [animation-delay:300ms]" />
              </div>
              <p
                className="text-xs text-[#1A1A2E]/50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {typingUserNames.length === 1
                  ? `${typingUserNames[0]} is typing`
                  : `${typingUserNames.join(", ")} are typing`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
