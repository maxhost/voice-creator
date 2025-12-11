/**
 * Shared types used across the application.
 */

export type AppError = {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
};

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type WithClassName = {
  className?: string;
};

export type WithChildren = {
  children: React.ReactNode;
};
