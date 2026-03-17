// FILE PATH: src/modules/auth/services/userService.ts
// Module 1.1: User Authentication & Management - User Profile Service

import apiClient from "@/api/client";
import { User } from "../types/auth.types";
import { tokenManager } from "../utils/tokenManager";

class UserService {
  /**
   * Update user profile information
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>("/users/profile", updates);
    return response.data;
  }

  /**
   * Upload user avatar image
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post<{ avatarUrl: string }>(
      "/users/avatar",
      formData,
      {
        headers: { "Content-Type": undefined as unknown as string },
      },
    );
    return response.data;
  }

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  }): Promise<void> {
    await apiClient.patch("/users/notification-preferences", preferences);
  }

  /**
   * Update landlord profile
   */
  async updateLandlordProfile(updates: {
    businessName?: string;
    businessRegistration?: string;
    taxId?: string;
  }): Promise<void> {
    await apiClient.patch("/users/landlord-profile", updates);
  }

  /**
   * Update tenant profile
   */
  async updateTenantProfile(updates: {
    employmentStatus?: string;
    annualIncome?: number;
    moveInDate?: string;
    pets?: boolean;
    numberOfOccupants?: number;
  }): Promise<void> {
    await apiClient.patch("/users/tenant-profile", updates);
  }

  /**
   * Update agent profile
   */
  async updateAgentProfile(updates: {
    licenseNumber?: string;
    licenseState?: string;
    brokerageName?: string;
    yearsOfExperience?: number;
    specializations?: string[];
  }): Promise<void> {
    await apiClient.patch("/users/agent-profile", updates);
  }

  /**
   * Delete user account permanently
   */
  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete("/users/account", {
      data: { password },
    });
    tokenManager.clearTokens();
  }

  /**
   * Get user activity log
   */
  async getActivityLog(page: number = 1, limit: number = 20): Promise<any[]> {
    const response = await apiClient.get<any[]>("/users/activity-log", {
      params: { page, limit },
    });
    return response.data;
  }
}

export const userService = new UserService();
