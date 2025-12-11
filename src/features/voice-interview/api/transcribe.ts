import type { Result } from '@/shared/lib';

type TranscribeResult = { transcript: string };
type TranscribeError = { code: 'TRANSCRIPTION_FAILED'; message: string };

export const transcribeAudio = async (
  audioBlob: Blob
): Promise<Result<TranscribeResult, TranscribeError>> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch('/api/voice/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: { code: 'TRANSCRIPTION_FAILED', message: error.error || 'Failed' },
      };
    }

    const data = await response.json();
    return { ok: true, data: { transcript: data.transcript } };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'TRANSCRIPTION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown',
      },
    };
  }
};
