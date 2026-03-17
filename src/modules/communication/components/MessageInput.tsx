import React, { useState, useRef, useCallback } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  isSending: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  onStopTyping,
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
    onStopTyping?.();

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      if (e.target.value.trim()) {
        onTyping?.();
      } else {
        onStopTyping?.();
      }
    },
    [onTyping, onStopTyping],
  );

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
      className="border-t border-[#C4A882]/20 bg-white p-4"
    >
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onBlur={() => onStopTyping?.()}
          placeholder="Type a message..."
          disabled={disabled || isSending}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[#C4A882]/30 bg-[#FAF6F1] px-4 py-2.5 text-sm text-[#2D2A26] placeholder-[#2D2A26]/40 focus:border-[#8B7355] focus:outline-none focus:ring-1 focus:ring-[#8B7355] disabled:opacity-50 transition-colors duration-200"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending || disabled}
          className="flex-shrink-0 rounded-xl bg-[#8B7355] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#A0926B] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Inter', sans-serif" }}
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
