import type { Result } from '@/shared/lib';

type GreetingResult = { audioBlob: Blob; greeting: string; language: string };
type GreetingError = { code: 'GREETING_FAILED'; message: string };

export const fetchGreeting = async (): Promise<Result<GreetingResult, GreetingError>> => {
  try {
    // Get browser language
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en';
    const langParam = `?lang=${encodeURIComponent(browserLang)}`;

    // Fetch audio and text in parallel
    const [audioResponse, textResponse] = await Promise.all([
      fetch(`/api/voice/greeting${langParam}`),
      fetch(`/api/voice/greeting${langParam}`, { method: 'POST' }),
    ]);

    if (!audioResponse.ok || !textResponse.ok) {
      return {
        ok: false,
        error: { code: 'GREETING_FAILED', message: 'Failed to fetch greeting' },
      };
    }

    const [audioBlob, { greeting, language }] = await Promise.all([
      audioResponse.blob(),
      textResponse.json() as Promise<{ greeting: string; language: string }>,
    ]);

    return { ok: true, data: { audioBlob, greeting, language } };
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
