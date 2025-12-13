'use client';

import { useEffect, useState } from 'react';

// Microphone icon (idle state)
const MicIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="white" strokeWidth="1.5" />
    <path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18V22M12 22H9M12 22H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Microphone with sound waves (recording state)
const MicRecordingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="white" strokeWidth="1.5" />
    <path d="M5 3V5M1 2V6M19 3V5M23 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
    <path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18V22M12 22H9M12 22H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Microphone with checkmark (sent state)
const MicSentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 20.5L17.5 22.5L22.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5" y="2" width="6" height="12" rx="3" fill="white" stroke="white" strokeWidth="1.5" />
    <path d="M1 10V11C1 14.866 4.13401 18 8 18C11.866 18 15 14.866 15 11V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18V22M8 22H5M8 22H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Processing wave animation
const ProcessingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-processing">
    <path d="M3 12C3.00015 8.14286 4.28571 3 6.85714 3C10.7143 2.9999 13.2857 21 17.1429 21C19.7143 21 21 15.8571 21 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.5 12H16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 12H8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RecordButtonProps = {
  isRecording: boolean;
  isProcessing?: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
};

export const RecordButton = ({
  isRecording,
  isProcessing = false,
  onStart,
  onStop,
  disabled = false,
}: RecordButtonProps) => {
  const [showSent, setShowSent] = useState(false);

  // Show sent icon briefly after recording stops
  useEffect(() => {
    if (!isRecording && !isProcessing && !disabled) {
      // Reset sent state when ready for new recording
      setShowSent(false);
    }
  }, [isRecording, isProcessing, disabled]);

  // When recording stops, show sent icon briefly
  const handleStop = () => {
    if (!isRecording) return;
    setShowSent(true);
    onStop();
    // Reset after animation
    setTimeout(() => setShowSent(false), 1500);
  };

  // Spacebar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !disabled && !isProcessing) {
        e.preventDefault();
        onStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRecording) handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, isRecording, isProcessing, onStart]);

  const handleMouseDown = () => {
    if (disabled || isProcessing) return;
    onStart();
  };

  const handleMouseUp = () => {
    handleStop();
  };

  const getIcon = () => {
    if (isProcessing) return <ProcessingIcon />;
    if (showSent) return <MicSentIcon />;
    if (isRecording) return <MicRecordingIcon />;
    return <MicIcon />;
  };

  const getButtonStyle = () => {
    if (isProcessing) return 'bg-amber-500';
    if (showSent) return 'bg-green-500';
    if (isRecording) return 'bg-red-500 scale-110';
    return 'bg-primary-600 hover:bg-primary-700';
  };

  return (
    <>
      <style jsx global>{`
        @keyframes processing {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.1); }
        }
        .animate-processing {
          animation: processing 1s ease-in-out infinite;
        }
      `}</style>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        disabled={disabled || isProcessing}
        className={`w-28 h-28 rounded-full transition-all duration-200 flex items-center justify-center
                    ${getButtonStyle()}
                    text-white font-bold text-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-4 focus:ring-primary-300`}
        aria-label={isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Hold to record'}
      >
        {getIcon()}
      </button>
    </>
  );
};
