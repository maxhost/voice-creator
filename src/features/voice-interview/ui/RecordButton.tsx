'use client';

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
      className={`w-24 h-24 rounded-full transition-all duration-200
                  ${isRecording
                    ? 'bg-red-500 scale-110 animate-pulse'
                    : 'bg-primary-600 hover:bg-primary-700'}
                  text-white font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isRecording ? 'Grabando...' : 'Mantener para grabar'}
    >
      {isRecording ? 'REC' : 'HOLD'}
    </button>
  );
};
