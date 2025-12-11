import type { Turn, Topic, Insight } from '@/entities/interview-session';

export type RecordingState = 'idle' | 'recording' | 'processing';

export type InterviewStatus =
  | 'idle'
  | 'waitingForUser'
  | 'recording'
  | 'processing'
  | 'aiResponding'
  | 'playingResponse'
  | 'closing'
  | 'finalResponse'
  | 'complete';

export type InterviewContext = {
  turns: Turn[];
  topics: Topic[];
  insights: Insight[];
  timeRemaining: number;
  currentTranscript: string | null;
  error: InterviewError | null;
  lastSpeaker: 'user' | 'ai' | null;
};

export type InterviewEvents =
  | { type: 'START' }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; audioBlob: Blob }
  | { type: 'TRANSCRIPTION_COMPLETE'; transcript: string; topics: string[] }
  | { type: 'AI_RESPONSE_READY'; response: string; audioUrl: string }
  | { type: 'AUDIO_PLAYBACK_COMPLETE' }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_END' }
  | { type: 'FINAL_RECORDING_COMPLETE'; audioBlob: Blob }
  | { type: 'ERROR'; error: InterviewError }
  | { type: 'RESET' };

export type InterviewError = {
  code: InterviewErrorCode;
  message: string;
  retryable: boolean;
};

export type InterviewErrorCode =
  | 'MICROPHONE_ACCESS_DENIED'
  | 'TRANSCRIPTION_FAILED'
  | 'AI_RESPONSE_FAILED'
  | 'TTS_FAILED'
  | 'UNKNOWN';
