import apiClient from "@/api/client";
import type { Message, Conversation } from "../../../types/communication";

interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

interface CreateConversationPayload {
  participantIds: string[];
  propertyId: string;
  subject: string;
  initialMessage: string;
}

class CommunicationService {
  async getConversations(): Promise<ConversationsResponse> {
    const response = await apiClient.get<ConversationsResponse>(
      "/communication/conversations",
    );
    return response.data;
  }

  async getMessages(
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<MessagesResponse> {
    const response = await apiClient.get<MessagesResponse>(
      `/communication/conversations/${conversationId}/messages`,
      { params: { page, limit } },
    );
    return response.data;
  }

  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    const response = await apiClient.post<Message>(
      `/communication/conversations/${payload.conversationId}/messages`,
      { content: payload.content },
    );
    return response.data;
  }

  async createConversation(
    payload: CreateConversationPayload,
  ): Promise<Conversation> {
    const response = await apiClient.post<Conversation>(
      "/communication/conversations",
      payload,
    );
    return response.data;
  }

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.put(
      `/communication/conversations/${conversationId}/read`,
    );
  }
}

export const communicationService = new CommunicationService();
