import React, { useState, useRef } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  isSending: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isSending,
  disabled = false,
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSending || disabled) return;

    onSend(trimmed);
    setContent("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message..."
          disabled={disabled || isSending}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-[#091a2b] placeholder-gray-400 focus:border-[#005163] focus:outline-none focus:ring-1 focus:ring-[#005163] disabled:opacity-50"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending || disabled}
          className="flex-shrink-0 rounded-xl bg-[#091a2b] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#005163] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Sending
            </span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
};
