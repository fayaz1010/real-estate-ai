// Service Worker for Push Notifications - RealEstateAI

const NOTIFICATION_ICON = "/favicon.svg";
const DEFAULT_URL = "/";

// Install event - activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Push event - display notification
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "RealEstateAI", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: payload.icon || NOTIFICATION_ICON,
    badge: payload.badge || NOTIFICATION_ICON,
    tag: payload.tag || "realestateai-notification",
    data: payload.data || {},
    actions: payload.actions || [],
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "RealEstateAI", options)
  );
});

// Notification click event - open relevant page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = DEFAULT_URL;

  // Route to relevant page based on notification type
  if (data.type) {
    if (data.type.startsWith("INSPECTION_") && data.inspectionId) {
      targetUrl = `/inspections/${data.inspectionId}`;
    } else if (data.type === "APPLICATION_STATUS" && data.propertyId) {
      targetUrl = `/applications`;
    } else if (data.notificationId) {
      targetUrl = `/dashboard`;
    }
  }

  // Handle action button clicks
  if (event.action === "view" && data.inspectionId) {
    targetUrl = `/inspections/${data.inspectionId}`;
  } else if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if available
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Open new window
        return self.clients.openWindow(targetUrl);
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  // Analytics or cleanup if needed
});
