'use client';

import { RecordButton, TranscriptDisplay, TimerDisplay, ThinkingIndicator } from '@/features/voice-interview';
import { useInterviewPanel } from '../model/useInterviewPanel';

export const InterviewPanel = () => {
  const {
    turns,
    timeRemaining,
    isRecording,
    isProcessing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  } = useInterviewPanel();

  const showThinking = isProcessing || isAiResponding;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Timer */}
      <div className="text-center">
        <TimerDisplay timeRemaining={timeRemaining} />
      </div>

      {/* Transcript */}
      <div className="border rounded-lg p-4 min-h-[200px]">
        <TranscriptDisplay turns={turns} />
      </div>

      {/* Status indicators */}
      <div className="h-8 flex items-center justify-center">
        <ThinkingIndicator
          isVisible={showThinking}
          message={isAiResponding ? 'Generando respuesta...' : 'Procesando audio...'}
        />
        {isPlayingResponse && (
          <span className="text-sm text-primary-600">Reproduciendo respuesta...</span>
        )}
      </div>

      {/* Record button */}
      <div className="flex justify-center">
        <RecordButton
          isRecording={isRecording}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          disabled={!canRecord}
        />
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500">
        {canRecord
          ? 'Mantén presionado para hablar'
          : 'Espera a que la IA termine de responder'}
      </p>
    </div>
  );
};
