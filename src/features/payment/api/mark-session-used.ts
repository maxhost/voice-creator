import type { Result } from '@/shared/lib';

type MarkUsedError = {
  code: 'MARK_USED_FAILED';
  message: string;
};

/**
 * Marks a payment session as used after interview completion.
 */
export const markSessionUsed = async (
  sessionId: string
): Promise<Result<void, MarkUsedError>> => {
  try {
    const response = await fetch('/api/stripe/mark-used', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: {
          code: 'MARK_USED_FAILED',
          message: error.error || 'Failed to mark session as used',
        },
      };
    }

    return { ok: true, data: undefined };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'MARK_USED_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
