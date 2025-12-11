import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

/**
 * ElevenLabs client for server-side TTS operations only.
 * Never expose to client.
 * Lazy initialization to avoid build-time errors.
 */
let elevenlabsClient: ElevenLabsClient | null = null;

// Voice IDs for different languages (all multilingual-compatible)
const VOICE_BY_LANGUAGE: Record<string, string> = {
  es: '21m00Tcm4TlvDq8ikWAM', // Rachel - works great for Spanish
  en: 'pNInz6obpgDQGcFmaJgB', // Adam - natural English
  fr: 'ThT5KcBeYPX3keUQqHPh', // Nicole - French-friendly
  de: 'VR6AewLTigWG4xSOukaG', // Arnold - German-friendly
  pt: '21m00Tcm4TlvDq8ikWAM', // Rachel - works for Portuguese
  it: 'ThT5KcBeYPX3keUQqHPh', // Nicole - Italian-friendly
};

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

export const getElevenLabs = (): ElevenLabsClient => {
  if (elevenlabsClient) return elevenlabsClient;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY environment variable');
  }

  elevenlabsClient = new ElevenLabsClient({ apiKey });
  return elevenlabsClient;
};

export const getVoiceId = (language?: string): string => {
  // Allow env override for any language
  if (process.env.ELEVENLABS_VOICE_ID) {
    return process.env.ELEVENLABS_VOICE_ID;
  }
  // Select voice based on detected language
  if (language && VOICE_BY_LANGUAGE[language]) {
    return VOICE_BY_LANGUAGE[language];
  }
  return DEFAULT_VOICE_ID;
};
