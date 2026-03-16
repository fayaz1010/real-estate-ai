// Notification Service - Frontend client for backend notification API
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

// Axios instance with auth interceptor
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Types ──────────────────────────────────────────────────────────

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inspectionReminders: boolean;
  inspectionUpdates: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  channel: string;
  status: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  readAt: string | null;
  sentAt: string | null;
  inspectionId?: string;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface NotificationTemplate {
  subject: string;
  body: string;
  variables: Record<string, string>;
}

// ─── Helper ─────────────────────────────────────────────────────────

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (!response.data.success) {
    throw new Error(response.data.message || "Request failed");
  }
  return response.data.data as T;
}

// ─── Service ────────────────────────────────────────────────────────

class NotificationService {
  // ─── User notification inbox ────────────────────────────────────

  async getMyNotifications(
    page = 1,
    limit = 20,
    unreadOnly = false,
  ): Promise<NotificationsResponse> {
    const response = await api.get<ApiResponse<NotificationsResponse>>(
      "/notifications",
      { params: { page, limit, unreadOnly } },
    );
    return unwrap(response);
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.patch<ApiResponse<Notification>>(
      `/notifications/${notificationId}/read`,
    );
    return unwrap(response);
  }

  async markAllAsRead(): Promise<{ updated: number }> {
    const response = await api.post<ApiResponse<{ updated: number }>>(
      "/notifications/read-all",
    );
    return unwrap(response);
  }

  // ─── Inspection notification triggers ───────────────────────────

  async sendInspectionConfirmation(
    inspectionId: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/confirmation`,
    );
    return unwrap(response);
  }

  async sendReminder(
    inspectionId: string,
    type: "24h" | "2h" | "30m",
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/reminder`,
      { type },
    );
    return unwrap(response);
  }

  async sendCancellationNotification(
    inspectionId: string,
    reason: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/cancellation`,
      { reason },
    );
    return unwrap(response);
  }

  async sendRescheduleNotification(
    inspectionId: string,
    newDate: string,
    newTime: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/reschedule`,
      { newDate, newTime },
    );
    return unwrap(response);
  }

  async sendCheckInNotification(
    inspectionId: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/check-in`,
    );
    return unwrap(response);
  }

  async sendCheckOutNotification(
    inspectionId: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/check-out`,
    );
    return unwrap(response);
  }

  async sendFollowUp(inspectionId: string): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/follow-up`,
    );
    return unwrap(response);
  }

  async sendNoShowNotification(
    inspectionId: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/no-show`,
    );
    return unwrap(response);
  }

  async scheduleReminders(inspectionId: string): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/schedule-reminders`,
    );
    return unwrap(response);
  }

  async cancelReminders(inspectionId: string): Promise<{ success: boolean }> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/reminders`,
    );
    return unwrap(response);
  }

  // ─── Preferences ───────────────────────────────────────────────

  async getNotificationPreferences(
    userId: string,
  ): Promise<NotificationPreferences> {
    const response = await api.get<ApiResponse<NotificationPreferences>>(
      `/notifications/preferences/${userId}`,
    );
    return unwrap(response);
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    const response = await api.patch<ApiResponse<NotificationPreferences>>(
      `/notifications/preferences/${userId}`,
      preferences,
    );
    return unwrap(response);
  }

  // ─── Admin / utility ───────────────────────────────────────────

  async testNotification(
    userId: string,
    type: "email" | "sms" | "push",
    template: string,
  ): Promise<{ success: boolean }> {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      "/notifications/test",
      { userId, type, template },
    );
    return unwrap(response);
  }

  async getTemplates(): Promise<Record<string, NotificationTemplate>> {
    const response = await api.get<
      ApiResponse<Record<string, NotificationTemplate>>
    >("/notifications/templates");
    return unwrap(response);
  }

  async batchSendNotifications(params: {
    inspectionIds: string[];
    type: "confirmation" | "reminder" | "cancellation";
  }): Promise<{ success: boolean; failed: string[] }> {
    const response = await api.post<
      ApiResponse<{ success: boolean; failed: string[] }>
    >("/notifications/batch", params);
    return unwrap(response);
  }

  // ─── Access code & directions (SMS-dependent, stubbed) ─────────

  async sendAccessCode(
    inspectionId: string,
    phoneNumber: string,
    code: string,
  ): Promise<{ success: boolean }> {
    // SMS integration placeholder — requires Twilio or similar service
    console.warn("SMS access code sending requires SMS provider configuration");
    return { success: false };
  }

  async sendDirections(
    inspectionId: string,
    method: "email" | "sms",
  ): Promise<{ success: boolean }> {
    if (method === "sms") {
      console.warn("SMS directions require SMS provider configuration");
      return { success: false };
    }
    // For email, trigger via the follow-up endpoint as a workaround
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/notifications/inspection/${inspectionId}/follow-up`,
    );
    return unwrap(response);
  }
}

// Create and export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
