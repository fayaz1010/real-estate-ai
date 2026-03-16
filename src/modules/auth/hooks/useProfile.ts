// FILE PATH: src/modules/auth/hooks/useProfile.ts
// Module 1.1: User Authentication & Management - Profile Management Hook

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { userService } from "../services/userService";
import { updateUser } from "../store/authSlice";
import { User } from "../types/auth.types";

export const useProfile = () => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);

      try {
        const updatedUser = await userService.updateProfile(updates);
        dispatch(updateUser(updatedUser));
        setSuccess("Profile updated successfully");
        return updatedUser;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch],
  );

  /**
   * Upload avatar image
   */
  const uploadAvatar = useCallback(
    async (file: File) => {
      // Validate file
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        throw new Error("Invalid file type");
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size must be less than 5MB");
        throw new Error("File too large");
      }

      setIsUpdating(true);
      setError(null);
      setSuccess(null);

      try {
        const { avatarUrl } = await userService.uploadAvatar(file);
        dispatch(updateUser({ avatar: avatarUrl }));
        setSuccess("Avatar updated successfully");
        return avatarUrl;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch],
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);

      try {
        await userService.changePassword(currentPassword, newPassword);
        setSuccess("Password changed successfully");
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  /**
   * Update notification preferences
   */
  const updateNotificationPreferences = useCallback(
    async (preferences: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      pushNotifications?: boolean;
    }) => {
      setIsUpdating(true);
      setError(null);

      try {
        await userService.updateNotificationPreferences(preferences);
        setSuccess("Preferences updated successfully");
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  /**
   * Update landlord profile
   */
  const updateLandlordProfile = useCallback(
    async (updates: {
      businessName?: string;
      businessRegistration?: string;
      taxId?: string;
    }) => {
      setIsUpdating(true);
      setError(null);

      try {
        await userService.updateLandlordProfile(updates);
        setSuccess("Landlord profile updated successfully");
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  /**
   * Update tenant profile
   */
  const updateTenantProfile = useCallback(
    async (updates: {
      employmentStatus?: string;
      annualIncome?: number;
      moveInDate?: string;
      pets?: boolean;
      numberOfOccupants?: number;
    }) => {
      setIsUpdating(true);
      setError(null);

      try {
        await userService.updateTenantProfile(updates);
        setSuccess("Tenant profile updated successfully");
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  /**
   * Update agent profile
   */
  const updateAgentProfile = useCallback(
    async (updates: {
      licenseNumber?: string;
      licenseState?: string;
      brokerageName?: string;
      yearsOfExperience?: number;
      specializations?: string[];
    }) => {
      setIsUpdating(true);
      setError(null);

      try {
        await userService.updateAgentProfile(updates);
        setSuccess("Agent profile updated successfully");
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  /**
   * Delete account
   */
  const deleteAccount = useCallback(async (password: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      await userService.deleteAccount(password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    // State
    isUpdating,
    error,
    success,

    // Actions
    updateProfile,
    uploadAvatar,
    changePassword,
    updateNotificationPreferences,
    updateLandlordProfile,
    updateTenantProfile,
    updateAgentProfile,
    deleteAccount,
    clearMessages,
  };
};
