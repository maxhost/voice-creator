import type { Post } from '@/entities/post';

export type GenerationStatus =
  | 'idle'
  | 'generating'
  | 'complete'
  | 'failed';

export type GenerationContext = {
  status: GenerationStatus;
  progress: number; // 0-100
  posts: Post[];
  error: GenerationError | null;
};

export type GenerationEvents =
  | { type: 'START_GENERATION'; sessionId: string }
  | { type: 'GENERATION_PROGRESS'; progress: number }
  | { type: 'GENERATION_COMPLETE'; posts: Post[] }
  | { type: 'GENERATION_FAILED'; error: GenerationError }
  | { type: 'RESET' };

export type GenerationError = {
  code: 'GENERATION_FAILED' | 'INVALID_CONTEXT' | 'UNKNOWN';
  message: string;
};

export type GeneratePostsInput = {
  turns: Array<{
    speaker: 'user' | 'ai';
    transcript: string;
  }>;
  topics: string[];
  insights: Array<{
    type: string;
    content: string;
  }>;
};
