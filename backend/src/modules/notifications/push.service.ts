// @ts-nocheck
// Push Notification Service - Web Push integration
import webpush from "web-push";

import config from "../../config/env";
import prisma from "../../config/database";

// Configure web-push with VAPID keys
if (config.vapid.publicKey && config.vapid.privateKey) {
  webpush.setVapidDetails(
    config.vapid.subject,
    config.vapid.publicKey,
    config.vapid.privateKey,
  );
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

export class PushService {
  /**
   * Save or update a user's push subscription.
   */
  async subscribe(
    userId: string,
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    userAgent?: string,
  ) {
    const existing = await prisma.pushSubscription.findUnique({
      where: {
        userId_endpoint: { userId, endpoint: subscription.endpoint },
      },
    });

    if (existing) {
      return prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
        },
      });
    }

    return prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
      },
    });
  }

  /**
   * Remove a push subscription.
   */
  async unsubscribe(userId: string, endpoint: string) {
    const sub = await prisma.pushSubscription.findUnique({
      where: { userId_endpoint: { userId, endpoint } },
    });

    if (sub) {
      await prisma.pushSubscription.delete({ where: { id: sub.id } });
    }

    return { success: true };
  }

  /**
   * Send a push notification to all of a user's subscribed devices.
   */
  async sendToUser(userId: string, payload: PushPayload) {
    if (!config.vapid.publicKey || !config.vapid.privateKey) {
      console.warn("VAPID keys not configured — skipping push notification");
      return { sent: 0, failed: 0 };
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const jsonPayload = JSON.stringify(payload);
    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      const pushSub: webpush.PushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };

      try {
        await webpush.sendNotification(pushSub, jsonPayload);
        sent++;
      } catch (error: unknown) {
        failed++;
        const statusCode =
          error instanceof webpush.WebPushError ? error.statusCode : 0;

        // 404 or 410 means subscription is no longer valid — clean up
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription
            .delete({ where: { id: sub.id } })
            .catch(() => {});
        } else {
          console.error(
            `Push send failed for subscription ${sub.id}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }
    }

    return { sent, failed };
  }

  /**
   * Get the VAPID public key for the frontend.
   */
  getPublicKey() {
    return config.vapid.publicKey;
  }
}

export default new PushService();
