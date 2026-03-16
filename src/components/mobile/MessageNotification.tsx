import React from 'react';
import type { MobileMessage } from '../../types/mobileMessaging';

interface MessageNotificationProps {
  message: MobileMessage;
  senderName: string;
  senderAvatar?: string;
  onPress: () => void;
  onDismiss?: () => void;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
  message,
  senderName,
  senderAvatar,
  onPress,
  onDismiss,
}) => {
  const preview = message.voiceNoteUrl
    ? '🎤 Voice note'
    : message.content.length > 80
      ? message.content.slice(0, 80) + '…'
      : message.content;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => e.key === 'Enter' && onPress()}
      className="mx-3 mt-2 flex cursor-pointer items-center gap-3 rounded-xl p-3 text-white shadow-lg transition-transform active:scale-[0.98]"
      style={{ backgroundColor: '#091a2b', fontFamily: "'Open Sans', sans-serif" }}
    >
      {senderAvatar ? (
        <img src={senderAvatar} alt={senderName} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
          {senderName.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{senderName}</p>
        <p className="truncate text-xs text-white/70">{preview}</p>
      </div>
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-white/50 hover:text-white/80"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default MessageNotification;
