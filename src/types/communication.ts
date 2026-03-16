export type SenderRole = 'manager' | 'tenant' | 'agent';

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  contentType: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: SenderRole;
  content: string;
  attachments?: Attachment[];
  readAt?: Date | null;
  createdAt: Date;
}

export interface Participant {
  userId: string;
  role: SenderRole;
  name: string;
  avatarUrl: string | null;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  propertyId: string;
  subject: string;
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  emailNewMessages: boolean;
  emailMaintenanceRequests: boolean;
  emailRentReminders: boolean;
  inAppNewMessages: boolean;
  inAppMaintenanceRequests: boolean;
  inAppRentReminders: boolean;
}
