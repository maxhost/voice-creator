/**
 * Application constants.
 * Values that don't change based on environment.
 */

// Interview settings
export const INTERVIEW_DURATION_SECONDS = 600; // 10 minutes
export const FINAL_RESPONSE_TIMEOUT_MS = 30000; // 30 seconds
export const MIN_POSTS_TO_GENERATE = 4;
export const MAX_POSTS_TO_GENERATE = 7;

// Audio settings
export const AUDIO_CHUNK_INTERVAL_MS = 1000;
export const SUPPORTED_AUDIO_FORMATS = ['audio/webm', 'audio/mp4', 'audio/wav'];

// Filler audio paths
export const FILLER_AUDIO_PATHS = [
  '/audio/fillers/thinking-01.mp3',
  '/audio/fillers/thinking-02.mp3',
  '/audio/fillers/thinking-03.mp3',
  '/audio/fillers/interesting-01.mp3',
  '/audio/fillers/interesting-02.mp3',
  '/audio/fillers/letmethink-01.mp3',
  '/audio/fillers/letmethink-02.mp3',
  '/audio/fillers/okay-01.mp3',
  '/audio/fillers/okay-02.mp3',
  '/audio/fillers/understand-01.mp3',
] as const;

// UI settings
export const TIMER_WARNING_THRESHOLD_SECONDS = 60; // Show warning at 1 minute left

// Platforms for post suggestions
export const SUPPORTED_PLATFORMS = [
  'linkedin',
  'twitter',
  'instagram',
  'tiktok',
  'youtube',
] as const;

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];
