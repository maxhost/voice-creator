'use client';

import { RecordButton, TranscriptDisplay, TimerDisplay, ThinkingIndicator } from '@/features/voice-interview';
import { useInterviewPanel } from '../model/useInterviewPanel';

export const InterviewPanel = () => {
  const {
    turns,
    timeRemaining,
    isRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  } = useInterviewPanel();

  const showThinking = isTranscribing || isAiResponding;

  const getStatusMessage = () => {
    if (isTranscribing) return 'Transcribiendo...';
    if (isAiResponding) return 'Generando respuesta...';
    return '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <TimerDisplay timeRemaining={timeRemaining} />
      </div>

      <div className="border rounded-lg p-4 min-h-[200px] bg-white">
        <TranscriptDisplay turns={turns} />
      </div>

      <div className="h-8 flex items-center justify-center">
        <ThinkingIndicator isVisible={showThinking} message={getStatusMessage()} />
        {isPlayingResponse && (
          <span className="text-sm text-primary-600 animate-pulse">Reproduciendo...</span>
        )}
      </div>

      <div className="flex justify-center">
        <RecordButton
          isRecording={isRecording}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          disabled={!canRecord}
        />
      </div>

      <p className="text-center text-sm text-gray-500">
        {canRecord ? 'Mantén presionado para hablar' : 'Espera a que la IA termine'}
      </p>
    </div>
  );
};
