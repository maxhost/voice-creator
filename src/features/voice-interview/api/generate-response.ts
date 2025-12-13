import type { Result } from '@/shared/lib';
import type { UserProfile } from '@/app/model/types';

type Turn = { role: 'user' | 'ai'; content: string };
type GenerateParams = {
  transcript: string;
  conversationHistory: Turn[];
  userProfile?: UserProfile;
};
type GenerateResult = { response: string; topics: string[]; language: string };
type GenerateError = { code: 'AI_RESPONSE_FAILED'; message: string };

export const generateAIResponse = async (
  params: GenerateParams
): Promise<Result<GenerateResult, GenerateError>> => {
  try {
    const response = await fetch('/api/voice/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: { code: 'AI_RESPONSE_FAILED', message: error.error || 'Failed' },
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: { response: data.response, topics: data.topics || [], language: data.language || 'es' },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'AI_RESPONSE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown',
      },
    };
  }
};
