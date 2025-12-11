import type { Result } from '@/shared/lib';

type MarkUsedError = {
  code: 'MARK_USED_FAILED';
  message: string;
};

type MarkUsedParams = {
  sessionId: string;
  ideasGenerated: number;
};

export const markSessionUsed = async (
  params: MarkUsedParams
): Promise<Result<void, MarkUsedError>> => {
  try {
    const response = await fetch('/api/stripe/mark-used', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: { code: 'MARK_USED_FAILED', message: error.error || 'Failed' },
      };
    }
    return { ok: true, data: undefined };
  } catch (error) {
    return {
      ok: false,
      error: { code: 'MARK_USED_FAILED', message: error instanceof Error ? error.message : 'Unknown' },
    };
  }
};
