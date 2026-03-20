import React, { useState, useEffect, useCallback } from "react";

import {
  messagingService,
  NotificationPreferences,
  PushPermissionStatus,
} from "../api/messagingService";

const defaultPreferences: NotificationPreferences = {
  newListings: true,
  inspectionReminders: true,
  paymentConfirmations: true,
  maintenanceUpdates: true,
};

const notificationLabels: Record<
  keyof NotificationPreferences,
  { title: string; description: string }
> = {
  newListings: {
    title: "New Listings",
    description:
      "Get notified when new properties matching your criteria are listed",
  },
  inspectionReminders: {
    title: "Inspection Reminders",
    description: "Receive reminders before scheduled property inspections",
  },
  paymentConfirmations: {
    title: "Payment Confirmations",
    description: "Get notified when rent payments are processed or due",
  },
  maintenanceUpdates: {
    title: "Maintenance Updates",
    description: "Stay informed about maintenance request progress",
  },
};

const getPermissionStatus = (): PushPermissionStatus => {
  if (!("Notification" in window)) {
    return { granted: false, denied: false, prompt: false };
  }
  return {
    granted: Notification.permission === "granted",
    denied: Notification.permission === "denied",
    prompt: Notification.permission === "default",
  };
};

export const PushNotificationManager: React.FC = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [permissionStatus, setPermissionStatus] =
    useState<PushPermissionStatus>(getPermissionStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await messagingService.getNotificationPreferences();
        setPreferences(saved);
      } catch {
        setError("Failed to load notification preferences");
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleToggle = useCallback(
    async (key: keyof NotificationPreferences) => {
      const updated = { ...preferences, [key]: !preferences[key] };
      setPreferences(updated);
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await messagingService.updateNotificationPreferences(updated);
        setSuccessMessage("Preferences updated");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch {
        setPreferences(preferences);
        setError("Failed to update preferences");
      } finally {
        setIsSaving(false);
      }
    },
    [preferences],
  );

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setError("Push notifications are not supported in this browser");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermissionStatus({
        granted: result === "granted",
        denied: result === "denied",
        prompt: result === "default",
      });

      if (result === "granted" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });
        await messagingService.registerPushToken(JSON.stringify(subscription));
      }
    } catch {
      setError("Failed to enable push notifications");
    }
  };

  const supportsNotifications = "Notification" in window;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#008080] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl font-['Inter']">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-1 text-xl font-semibold text-[#1A1A2E]">
          Push Notifications
        </h2>
        <p className="mb-6 text-sm text-[#1A1A2E]/60">
          Manage how you receive push notifications
        </p>

        {/* Permission Status Banner */}
        <div className="mb-6 rounded-lg border p-4">
          {!supportsNotifications ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#1A1A2E]">Not Supported</p>
                <p className="text-sm text-[#1A1A2E]/60">
                  Your browser does not support push notifications.
                </p>
              </div>
            </div>
          ) : permissionStatus.granted ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#1A1A2E]">
                  Notifications Enabled
                </p>
                <p className="text-sm text-[#1A1A2E]/60">
                  You will receive push notifications for your selected
                  preferences.
                </p>
              </div>
            </div>
          ) : permissionStatus.denied ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#1A1A2E]">
                  Notifications Blocked
                </p>
                <p className="text-sm text-[#1A1A2E]/60">
                  Push notifications have been blocked. Please enable them in
                  your browser settings.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#008080]/10">
                  <svg
                    className="h-5 w-5 text-[#008080]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A2E]">
                    Enable Notifications
                  </p>
                  <p className="text-sm text-[#1A1A2E]/60">
                    Allow push notifications to stay updated.
                  </p>
                </div>
              </div>
              <button
                onClick={requestPermission}
                className="shrink-0 rounded-lg bg-[#008080] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#008080]/90"
              >
                Enable
              </button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Notification Toggles */}
        <div className="space-y-1">
          {(
            Object.keys(notificationLabels) as Array<
              keyof NotificationPreferences
            >
          ).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-[#FFFFFF]"
            >
              <div className="mr-4">
                <p className="font-medium text-[#1A1A2E]">
                  {notificationLabels[key].title}
                </p>
                <p className="text-sm text-[#1A1A2E]/60">
                  {notificationLabels[key].description}
                </p>
              </div>
              <button
                onClick={() => handleToggle(key)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  preferences[key] ? "bg-[#008080]" : "bg-gray-300"
                } ${isSaving ? "opacity-50" : ""}`}
                role="switch"
                aria-checked={preferences[key]}
                aria-label={`Toggle ${notificationLabels[key].title}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    preferences[key] ? "translate-x-5" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PushNotificationManager;
