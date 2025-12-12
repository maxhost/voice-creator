'use client';

import { useEffect } from 'react';

type RecordButtonProps = {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
};

export const RecordButton = ({
  isRecording,
  onStart,
  onStop,
  disabled = false,
}: RecordButtonProps) => {
  // Spacebar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !disabled) {
        e.preventDefault();
        onStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRecording) onStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, isRecording, onStart, onStop]);

  const handleMouseDown = () => {
    if (disabled) return;
    onStart();
  };

  const handleMouseUp = () => {
    if (!isRecording) return;
    onStop();
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      disabled={disabled}
      className={`w-28 h-28 rounded-full transition-all duration-200
                  ${isRecording
                    ? 'bg-red-500 scale-110 animate-pulse'
                    : 'bg-primary-600 hover:bg-primary-700'}
                  text-white font-bold text-lg
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-primary-300`}
      aria-label={isRecording ? 'Recording...' : 'Hold to record'}
    >
      {isRecording ? '● REC' : '🎤'}
    </button>
  );
};
