import type { Result } from '@/shared/lib';

type TTSError = { code: 'TTS_FAILED'; message: string };

export const textToSpeech = async (
  text: string,
  language?: string
): Promise<Result<Blob, TTSError>> => {
  try {
    const response = await fetch('/api/voice/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: { code: 'TTS_FAILED', message: error.error || 'Failed' },
      };
    }

    const audioBlob = await response.blob();
    return { ok: true, data: audioBlob };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'TTS_FAILED',
        message: error instanceof Error ? error.message : 'Unknown',
      },
    };
  }
};
