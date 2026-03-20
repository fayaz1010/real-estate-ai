// Stripe API Client — all Stripe secret-key operations run on the backend.
// The frontend ONLY uses the publishable key (via VITE_STRIPE_PUBLISHABLE_KEY)
// for client-side Stripe.js / Elements. Every sensitive operation is proxied
// through the backend /stripe and /billing API endpoints.

export {
  createCustomer,
  createSubscription,
  cancelSubscription,
  getInvoiceHistory,
  createCheckoutSession,
  getSubscriptionStatus,
  getUpcomingInvoice,
  createPaymentIntent,
  retrievePaymentIntent,
} from "../../server/services/stripeService";

export type {
  StripeInvoice,
  UpcomingInvoice,
  PaymentIntentInfo,
} from "../../server/services/stripeService";

// Consolidated stripe route client (payment intent, subscription, cancel)
export {
  createPaymentIntent as createStripePaymentIntent,
  createSubscription as createStripeSubscription,
  cancelSubscription as cancelStripeSubscription,
} from "../../server/routes/stripeRoutes";

export type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CancelSubscriptionRequest,
} from "../../server/routes/stripeRoutes";
