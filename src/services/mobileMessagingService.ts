import type {
  MobileMessage,
  Conversation,
  QuickReplyOption,
} from "../types/mobileMessaging";

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantIds: ["user-1", "user-2"],
    participantNames: ["You", "Sarah Johnson"],
    participantAvatars: ["", "https://i.pravatar.cc/40?img=1"],
    lastMessage: {
      id: "msg-3",
      senderId: "user-2",
      content: "The plumber is scheduled for tomorrow at 10am.",
      timestamp: new Date("2026-03-17T09:30:00"),
      isQuickReply: false,
    },
    unreadCount: 1,
  },
  {
    id: "conv-2",
    participantIds: ["user-1", "user-3"],
    participantNames: ["You", "Mike Chen"],
    participantAvatars: ["", "https://i.pravatar.cc/40?img=3"],
    lastMessage: {
      id: "msg-6",
      senderId: "user-1",
      content: "Rent has been submitted for March.",
      timestamp: new Date("2026-03-16T14:20:00"),
      isQuickReply: false,
    },
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participantIds: ["user-1", "user-4"],
    participantNames: ["You", "Property Management"],
    participantAvatars: ["", "https://i.pravatar.cc/40?img=5"],
    lastMessage: {
      id: "msg-9",
      senderId: "user-4",
      content: "Your lease renewal documents are ready for review.",
      timestamp: new Date("2026-03-15T11:00:00"),
      isQuickReply: false,
    },
    unreadCount: 2,
  },
];

const mockMessages: Record<string, MobileMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      senderId: "user-1",
      content: "Hi, the kitchen faucet is leaking again.",
      timestamp: new Date("2026-03-17T08:00:00"),
      isQuickReply: false,
    },
    {
      id: "msg-2",
      senderId: "user-2",
      content: "Thanks for letting me know. I'll arrange a plumber.",
      timestamp: new Date("2026-03-17T08:45:00"),
      isQuickReply: false,
    },
    {
      id: "msg-3",
      senderId: "user-2",
      content: "The plumber is scheduled for tomorrow at 10am.",
      timestamp: new Date("2026-03-17T09:30:00"),
      isQuickReply: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-4",
      senderId: "user-3",
      content: "Hi, just a reminder that rent is due on the 15th.",
      timestamp: new Date("2026-03-14T10:00:00"),
      isQuickReply: false,
    },
    {
      id: "msg-5",
      senderId: "user-1",
      content: "Thanks for the reminder!",
      timestamp: new Date("2026-03-14T10:30:00"),
      isQuickReply: true,
    },
    {
      id: "msg-6",
      senderId: "user-1",
      content: "Rent has been submitted for March.",
      timestamp: new Date("2026-03-16T14:20:00"),
      isQuickReply: false,
    },
  ],
  "conv-3": [
    {
      id: "msg-7",
      senderId: "user-4",
      content: "Your lease is up for renewal next month.",
      timestamp: new Date("2026-03-15T10:00:00"),
      isQuickReply: false,
    },
    {
      id: "msg-8",
      senderId: "user-1",
      content: "I'd like to renew. What are the terms?",
      timestamp: new Date("2026-03-15T10:30:00"),
      isQuickReply: false,
    },
    {
      id: "msg-9",
      senderId: "user-4",
      content: "Your lease renewal documents are ready for review.",
      timestamp: new Date("2026-03-15T11:00:00"),
      isQuickReply: false,
    },
  ],
};

const defaultQuickReplies: QuickReplyOption[] = [
  {
    id: "qr-1",
    text: "Submit maintenance request",
    icon: "🔧",
    category: "maintenance",
  },
  {
    id: "qr-2",
    text: "Payment received, thanks!",
    icon: "💰",
    category: "payment",
  },
  {
    id: "qr-3",
    text: "Thanks for the update!",
    icon: "👍",
    category: "general",
  },
  {
    id: "qr-4",
    text: "When is this scheduled?",
    icon: "📅",
    category: "general",
  },
  {
    id: "qr-5",
    text: "Issue is still ongoing",
    icon: "⚠️",
    category: "maintenance",
  },
  { id: "qr-6", text: "Payment sent", icon: "✅", category: "payment" },
];

export async function fetchConversations(): Promise<Conversation[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return mockConversations;
}

export async function fetchMessages(
  conversationId: string,
): Promise<MobileMessage[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockMessages[conversationId] ?? [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  options?: {
    isQuickReply?: boolean;
    replyTo?: string;
    voiceNoteUrl?: string;
    voiceDuration?: number;
  },
): Promise<MobileMessage> {
  await new Promise((r) => setTimeout(r, 150));
  const message: MobileMessage = {
    id: `msg-${Date.now()}`,
    senderId: "user-1",
    content,
    timestamp: new Date(),
    isQuickReply: options?.isQuickReply ?? false,
    replyTo: options?.replyTo,
    voiceNoteUrl: options?.voiceNoteUrl,
    voiceDuration: options?.voiceDuration,
  };

  if (mockMessages[conversationId]) {
    mockMessages[conversationId].push(message);
  }

  return message;
}

export async function uploadVoiceNote(
  _blob: Blob,
): Promise<{ url: string; duration: number }> {
  // Stub: in production this would upload to storage
  await new Promise((r) => setTimeout(r, 500));
  return {
    url: "https://example.com/voice-notes/stub.webm",
    duration: 0,
  };
}

export function getQuickReplies(
  category?: "maintenance" | "payment" | "general",
): QuickReplyOption[] {
  if (category) {
    return defaultQuickReplies.filter((qr) => qr.category === category);
  }
  return defaultQuickReplies;
}
