// FILE PATH: src/modules/auth/services/userService.ts
// Module 1.1: User Authentication & Management - User Profile Service

import { User } from "../types/auth.types";
import { tokenManager } from "../utils/tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class UserService {
  /**
   * Update user profile information
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  }

  /**
   * Upload user avatar image
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers: tokenManager.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload avatar");
    }

    return response.json();
  }

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  }): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/users/notification-preferences`,
      {
        method: "PATCH",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update notification preferences");
    }
  }

  /**
   * Update landlord profile
   */
  async updateLandlordProfile(updates: {
    businessName?: string;
    businessRegistration?: string;
    taxId?: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/landlord-profile`, {
      method: "PATCH",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update landlord profile");
    }
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
    const response = await fetch(`${API_BASE_URL}/users/tenant-profile`, {
      method: "PATCH",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update tenant profile");
    }
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
    const response = await fetch(`${API_BASE_URL}/users/agent-profile`, {
      method: "PATCH",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update agent profile");
    }
  }

  /**
   * Delete user account permanently
   */
  async deleteAccount(password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: "DELETE",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete account");
    }

    tokenManager.clearTokens();
  }

  /**
   * Get user activity log
   */
  async getActivityLog(page: number = 1, limit: number = 20): Promise<any[]> {
    const response = await fetch(
      `${API_BASE_URL}/users/activity-log?page=${page}&limit=${limit}`,
      {
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch activity log");
    }

    return response.json();
  }
}

export const userService = new UserService();
