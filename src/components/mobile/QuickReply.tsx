import React from "react";

import type { QuickReplyOption } from "../../types/mobileMessaging";

interface QuickReplyProps {
  options: QuickReplyOption[];
  onSelect: (option: QuickReplyOption) => void;
}

const QuickReply: React.FC<QuickReplyProps> = ({ options, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-3 scrollbar-hide">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-white transition-opacity hover:opacity-90 active:opacity-75"
          style={{
            backgroundColor: "#FF6B35",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {option.icon && <span>{option.icon}</span>}
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickReply;
