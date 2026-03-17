const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

export interface NotificationPreferences {
  newListings: boolean;
  inspectionReminders: boolean;
  paymentConfirmations: boolean;
  maintenanceUpdates: boolean;
}

export interface PushPermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export const messagingService = {
  sendPushNotification: async (
    userId: string,
    title: string,
    body: string,
  ): Promise<void> => {
    await apiCall("/messaging/push/send", {
      method: "POST",
      body: JSON.stringify({ userId, title, body }),
    });
  },

  sendSMSVerificationCode: async (phoneNumber: string): Promise<void> => {
    await apiCall("/messaging/sms/send-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  verifySMSCode: async (
    phoneNumber: string,
    code: string,
  ): Promise<boolean> => {
    const result = await apiCall("/messaging/sms/verify-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, code }),
    });
    return result.verified;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    return apiCall("/messaging/preferences");
  },

  updateNotificationPreferences: async (
    preferences: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    return apiCall("/messaging/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },

  registerPushToken: async (token: string): Promise<void> => {
    await apiCall("/messaging/push/register", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },
};
