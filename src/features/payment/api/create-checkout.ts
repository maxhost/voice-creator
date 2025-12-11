import type { Result } from '@/shared/lib';

type CreateCheckoutResult = {
  sessionId: string;
  url: string;
};

type CreateCheckoutError = {
  code: 'CHECKOUT_FAILED';
  message: string;
};

/**
 * Creates a Stripe Checkout session and returns the URL to redirect to.
 */
export const createCheckout = async (): Promise<
  Result<CreateCheckoutResult, CreateCheckoutError>
> => {
  try {
    const response = await fetch('/api/stripe/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: {
          code: 'CHECKOUT_FAILED',
          message: error.error || 'Failed to create checkout session',
        },
      };
    }

    const data = await response.json();

    return {
      ok: true,
      data: {
        sessionId: data.sessionId,
        url: data.url,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'CHECKOUT_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
