import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { Message, Conversation } from "../../../types/communication";
import { communicationService } from "../api/communicationService";

interface CommunicationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
  messagesTotal: number;
  messagesPage: number;
  typingUsers: Record<string, string[]>; // conversationId -> userId[]
  onlineUserIds: string[];
}

const initialState: CommunicationState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
  messagesTotal: 0,
  messagesPage: 1,
  typingUsers: {},
  onlineUserIds: [],
};

export const fetchConversations = createAsyncThunk(
  "communication/fetchConversations",
  async () => {
    const response = await communicationService.getConversations();
    return response;
  },
);

export const fetchMessages = createAsyncThunk(
  "communication/fetchMessages",
  async ({
    conversationId,
    page,
  }: {
    conversationId: string;
    page?: number;
  }) => {
    const response = await communicationService.getMessages(
      conversationId,
      page,
    );
    return response;
  },
);

export const sendMessage = createAsyncThunk(
  "communication/sendMessage",
  async ({
    conversationId,
    content,
  }: {
    conversationId: string;
    content: string;
  }) => {
    const message = await communicationService.sendMessage({
      conversationId,
      content,
    });
    return message;
  },
);

export const markConversationRead = createAsyncThunk(
  "communication/markAsRead",
  async (conversationId: string) => {
    await communicationService.markAsRead(conversationId);
    return conversationId;
  },
);

const communicationSlice = createSlice({
  name: "communication",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      state.messages = [];
      state.messagesPage = 1;
    },
    clearError(state) {
      state.error = null;
    },
    addRealtimeMessage(state, action: PayloadAction<Message>) {
      const msg = action.payload;
      // Only add if it belongs to the active conversation and isn't a duplicate
      if (
        msg.conversationId === state.activeConversationId &&
        !state.messages.some((m) => m.id === msg.id)
      ) {
        state.messages.push(msg);
      }
      // Update last message in conversation list
      const convo = state.conversations.find(
        (c) => c.id === msg.conversationId,
      );
      if (convo) {
        convo.lastMessage = msg;
        convo.updatedAt = new Date() as unknown as Date;
      }
    },
    setTypingUsers(
      state,
      action: PayloadAction<{ conversationId: string; userIds: string[] }>,
    ) {
      state.typingUsers[action.payload.conversationId] = action.payload.userIds;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUserIds = action.payload;
    },
    addOnlineUser(state, action: PayloadAction<string>) {
      if (!state.onlineUserIds.includes(action.payload)) {
        state.onlineUserIds.push(action.payload);
      }
    },
    removeOnlineUser(state, action: PayloadAction<string>) {
      state.onlineUserIds = state.onlineUserIds.filter(
        (id) => id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.error.message || "Failed to load conversations";
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload.messages;
        state.messagesTotal = action.payload.total;
        state.messagesPage = action.payload.page;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.error.message || "Failed to load messages";
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.error.message || "Failed to send message";
      })
      // Mark as read
      .addCase(markConversationRead.fulfilled, (state, action) => {
        const convo = state.conversations.find((c) => c.id === action.payload);
        if (convo) {
          convo.unreadCount = 0;
        }
      });
  },
});

export const {
  setActiveConversation,
  clearError,
  addRealtimeMessage,
  setTypingUsers,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
} = communicationSlice.actions;
export default communicationSlice.reducer;
