import type { Result } from '@/shared/lib';
import type { UserProfile } from '@/app/model/types';

type GreetingResult = { audioBlob: Blob; greeting: string; language: string };
type GreetingError = { code: 'GREETING_FAILED'; message: string };

export const fetchGreeting = async (
  userProfile: UserProfile
): Promise<Result<GreetingResult, GreetingError>> => {
  try {
    const response = await fetch('/api/voice/greeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: { code: 'GREETING_FAILED', message: 'Failed to fetch greeting' },
      };
    }

    const audioBlob = await response.blob();
    const greeting = decodeURIComponent(response.headers.get('X-Greeting-Text') || '');
    const language = response.headers.get('X-Language') || 'en';

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
