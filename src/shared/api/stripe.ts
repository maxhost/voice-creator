import Stripe from 'stripe';

/**
 * Stripe client for server-side operations only.
 * Never expose to client.
 * Lazy initialization to avoid build-time errors.
 */
let stripeClient: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (stripeClient) return stripeClient;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }

  stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
  });

  return stripeClient;
};

// Alias for backwards compatibility - use getStripe() for lazy init
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

/**
 * Price ID for the interview product.
 * Create this in Stripe Dashboard.
 */
export const INTERVIEW_PRICE_ID = process.env.STRIPE_PRICE_ID || '';

/**
 * Interview price in cents.
 */
export const INTERVIEW_PRICE_CENTS = 399;
