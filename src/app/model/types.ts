import type { Turn, Topic, Insight } from '@/entities/interview-session';
import type { Post } from '@/entities/post';

/**
 * Main application state machine context.
 * Single source of truth for the entire app state.
 */
export type AppContext = {
  // Session
  sessionId: string | null;

  // Payment
  payment: {
    status: 'idle' | 'pending' | 'confirmed' | 'failed';
    intentId: string | null;
    error: string | null;
  };

  // Interview
  interview: {
    turns: Turn[];
    topics: Topic[];
    insights: Insight[];
    timeRemaining: number;
    lastSpeaker: 'user' | 'ai' | null;
    currentAudioUrl: string | null;
  };

  // Generation
  generation: {
    status: 'idle' | 'generating' | 'complete' | 'failed';
    progress: number;
    posts: Post[];
  };

  // Error
  error: AppError | null;
};

export type AppError = {
  code: string;
  message: string;
  retryable: boolean;
};

export type AppEvents =
  // Payment events
  | { type: 'INIT_PAYMENT' }
  | { type: 'PAYMENT_SUCCESS'; intentId: string; sessionId: string }
  | { type: 'PAYMENT_FAILED'; error: string }
  | { type: 'PAYMENT_CANCELLED' }

  // Interview events
  | { type: 'START_INTERVIEW'; sessionId: string }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; audioBlob: Blob }
  | { type: 'TRANSCRIPTION_COMPLETE'; transcript: string; topics: string[] }
  | { type: 'AI_RESPONSE_READY'; response: string; audioUrl: string }
  | { type: 'AUDIO_PLAYBACK_COMPLETE' }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_END' }
  | { type: 'FINAL_RESPONSE'; audioBlob: Blob }
  | { type: 'SKIP_FINAL_RESPONSE' }

  // Generation events
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_PROGRESS'; progress: number }
  | { type: 'GENERATION_COMPLETE'; posts: Post[] }
  | { type: 'GENERATION_FAILED'; error: string }

  // General
  | { type: 'SET_ERROR'; error: AppError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };
