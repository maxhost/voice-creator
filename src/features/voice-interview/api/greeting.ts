import type { Result } from '@/shared/lib';

type GreetingResult = { audioBlob: Blob; greeting: string };
type GreetingError = { code: 'GREETING_FAILED'; message: string };

export const fetchGreeting = async (): Promise<Result<GreetingResult, GreetingError>> => {
  try {
    // Fetch audio and text in parallel
    const [audioResponse, textResponse] = await Promise.all([
      fetch('/api/voice/greeting'),
      fetch('/api/voice/greeting', { method: 'POST' }),
    ]);

    if (!audioResponse.ok || !textResponse.ok) {
      return {
        ok: false,
        error: { code: 'GREETING_FAILED', message: 'Failed to fetch greeting' },
      };
    }

    const [audioBlob, { greeting }] = await Promise.all([
      audioResponse.blob(),
      textResponse.json() as Promise<{ greeting: string }>,
    ]);

    return { ok: true, data: { audioBlob, greeting } };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'GREETING_FAILED',
        message: error instanceof Error ? error.message : 'Unknown',
      },
    };
  }
};
