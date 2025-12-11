import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

/**
 * ElevenLabs client for server-side TTS operations only.
 * Never expose to client.
 * Lazy initialization to avoid build-time errors.
 */
let elevenlabsClient: ElevenLabsClient | null = null;

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - natural female voice

export const getElevenLabs = (): ElevenLabsClient => {
  if (elevenlabsClient) return elevenlabsClient;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY environment variable');
  }

  elevenlabsClient = new ElevenLabsClient({ apiKey });
  return elevenlabsClient;
};

export const getVoiceId = (): string => {
  return process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
};
