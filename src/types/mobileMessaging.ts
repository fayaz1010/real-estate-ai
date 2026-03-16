// Base Message type (no existing one in codebase)
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Reaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface MobileMessage extends Message {
  voiceNoteUrl?: string;
  voiceDuration?: number;
  isQuickReply: boolean;
  replyTo?: string;
  reactions?: Reaction[];
}

export interface QuickReplyOption {
  id: string;
  text: string;
  icon?: string;
  category: 'maintenance' | 'payment' | 'general';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage: MobileMessage;
  unreadCount: number;
}
