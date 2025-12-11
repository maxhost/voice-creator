import type { Result } from '@/shared/lib';

type VerifySessionResult = {
  status: 'paid' | 'pending' | 'used' | 'error';
  sessionId: string;
};

type VerifySessionError = {
  code: 'VERIFICATION_FAILED' | 'SESSION_USED' | 'PAYMENT_PENDING';
  message: string;
};

/**
 * Verifies if a Stripe session has been paid.
 */
export const verifySession = async (
  sessionId: string
): Promise<Result<VerifySessionResult, VerifySessionError>> => {
  try {
    const response = await fetch(
      `/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`
    );

    const data = await response.json();

    if (data.status === 'paid') {
      return {
        ok: true,
        data: {
          status: 'paid',
          sessionId: data.sessionId,
        },
      };
    }

    if (data.status === 'used') {
      return {
        ok: false,
        error: {
          code: 'SESSION_USED',
          message: 'This session has already been used',
        },
      };
    }

    if (data.status === 'pending') {
      return {
        ok: false,
        error: {
          code: 'PAYMENT_PENDING',
          message: 'Payment has not been completed',
        },
      };
    }

    return {
      ok: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: data.error || 'Failed to verify session',
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
