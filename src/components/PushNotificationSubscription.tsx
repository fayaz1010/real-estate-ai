import { Bell, BellOff, Loader } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { notificationService } from "@/modules/inspections/services/notificationService";

type PushState =
  | "loading"
  | "unsupported"
  | "denied"
  | "subscribed"
  | "unsubscribed"
  | "error";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported");
  }
  return navigator.serviceWorker.register("/service-worker.js");
}

export const PushNotificationSubscription: React.FC = () => {
  const [state, setState] = useState<PushState>("loading");
  const [busy, setBusy] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    const permission = Notification.permission;
    if (permission === "denied") {
      setState("denied");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setState(subscription ? "subscribed" : "unsubscribed");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const handleSubscribe = async () => {
    setBusy(true);
    try {
      const registration = await registerServiceWorker();
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      // Get VAPID public key from env or API
      let vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
      if (!vapidKey) {
        vapidKey = await notificationService.getVapidPublicKey();
      }

      const applicationServerKey = urlBase64ToUint8Array(vapidKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      // Send subscription to backend
      await notificationService.subscribePush(subscription.toJSON());
      setState("subscribed");
    } catch (err) {
      console.error("Push subscription failed:", err);
      setState("error");
    } finally {
      setBusy(false);
    }
  };

  const handleUnsubscribe = async () => {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await notificationService.unsubscribePush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState("unsubscribed");
    } catch (err) {
      console.error("Push unsubscription failed:", err);
      setState("error");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <Loader className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500 font-['Inter']">
          Checking notification status...
        </span>
      </div>
    );
  }

  if (state === "unsupported") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <BellOff className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-[#1A1A2E] font-['Manrope']">
            Push Notifications
          </p>
          <p className="text-xs text-gray-500 font-['Inter']">
            Your browser does not support push notifications.
          </p>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
        <BellOff className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-sm font-medium text-[#1A1A2E] font-['Manrope']">
            Push Notifications Blocked
          </p>
          <p className="text-xs text-gray-600 font-['Inter']">
            Notifications are blocked. Please enable them in your browser
            settings.
          </p>
        </div>
      </div>
    );
  }

  if (state === "subscribed") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-[#1A1A2E] font-['Manrope']">
              Push Notifications Active
            </p>
            <p className="text-xs text-gray-600 font-['Inter']">
              You will receive push notifications for important updates.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnsubscribe}
          disabled={busy}
        >
          {busy ? <Loader className="h-4 w-4 animate-spin" /> : "Disable"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-[#008080]" />
        <div>
          <p className="text-sm font-medium text-[#1A1A2E] font-['Manrope']">
            Push Notifications
          </p>
          <p className="text-xs text-gray-500 font-['Inter']">
            {state === "error"
              ? "Something went wrong. Try again."
              : "Get notified about inspections, applications, and more."}
          </p>
        </div>
      </div>
      <Button
        variant="default"
        size="sm"
        onClick={handleSubscribe}
        disabled={busy}
      >
        {busy ? <Loader className="h-4 w-4 animate-spin" /> : "Enable"}
      </Button>
    </div>
  );
};

export default PushNotificationSubscription;
