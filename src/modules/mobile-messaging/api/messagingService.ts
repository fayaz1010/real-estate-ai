import apiClient from "@/api/client";

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
    await apiClient.post("/messaging/push/send", { userId, title, body });
  },

  sendSMSVerificationCode: async (phoneNumber: string): Promise<void> => {
    await apiClient.post("/messaging/sms/send-code", { phoneNumber });
  },

  verifySMSCode: async (
    phoneNumber: string,
    code: string,
  ): Promise<boolean> => {
    const response = await apiClient.post("/messaging/sms/verify-code", {
      phoneNumber,
      code,
    });
    return response.data.verified;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get<NotificationPreferences>(
      "/messaging/preferences",
    );
    return response.data;
  },

  updateNotificationPreferences: async (
    preferences: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    const response = await apiClient.put<NotificationPreferences>(
      "/messaging/preferences",
      preferences,
    );
    return response.data;
  },

  registerPushToken: async (token: string): Promise<void> => {
    await apiClient.post("/messaging/push/register", { token });
  },
};
