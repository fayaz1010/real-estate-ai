import { tokenManager } from "../../auth/utils/tokenManager";
import type { Message, Conversation } from "../../../types/communication";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

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
  private getHeaders(): HeadersInit {
    return {
      ...tokenManager.getAuthHeader(),
      "Content-Type": "application/json",
    };
  }

  async getConversations(): Promise<ConversationsResponse> {
    const response = await fetch(`${API_BASE_URL}/communication/conversations`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch conversations");
    }

    return response.json();
  }

  async getMessages(
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<MessagesResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await fetch(
      `${API_BASE_URL}/communication/conversations/${conversationId}/messages?${params}`,
      { headers: this.getHeaders() },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch messages");
    }

    return response.json();
  }

  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    const response = await fetch(
      `${API_BASE_URL}/communication/conversations/${payload.conversationId}/messages`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ content: payload.content }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to send message");
    }

    return response.json();
  }

  async createConversation(
    payload: CreateConversationPayload,
  ): Promise<Conversation> {
    const response = await fetch(
      `${API_BASE_URL}/communication/conversations`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create conversation");
    }

    return response.json();
  }

  async markAsRead(conversationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/communication/conversations/${conversationId}/read`,
      {
        method: "PUT",
        headers: this.getHeaders(),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to mark as read");
    }
  }
}

export const communicationService = new CommunicationService();
