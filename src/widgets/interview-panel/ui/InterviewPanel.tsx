'use client';

import { RecordButton, TranscriptDisplay, TimerDisplay, ThinkingIndicator } from '@/features/voice-interview';
import { useInterviewPanel } from '../model/useInterviewPanel';

const LANGUAGE_HINT: Record<string, string> = {
  es: 'Puedes hablar en cualquier idioma y la IA responderá en ese idioma',
  en: 'You can speak in any language and the AI will respond in that language',
  fr: 'Vous pouvez parler dans n\'importe quelle langue et l\'IA répondra dans cette langue',
  de: 'Sie können in jeder Sprache sprechen und die KI wird in dieser Sprache antworten',
  pt: 'Você pode falar em qualquer idioma e a IA responderá nesse idioma',
  it: 'Puoi parlare in qualsiasi lingua e l\'IA risponderà in quella lingua',
};

export const InterviewPanel = () => {
  const {
    turns,
    timeRemaining,
    isGreeting,
    isRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  } = useInterviewPanel();

  const showThinking = isGreeting || isTranscribing || isAiResponding;
  const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
  const languageHint = LANGUAGE_HINT[browserLang] || LANGUAGE_HINT.en;

  const getStatusMessage = () => {
    if (isGreeting) return 'Preparing greeting...';
    if (isTranscribing) return 'Transcribing...';
    if (isAiResponding) return 'Generating response...';
    return '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <TimerDisplay timeRemaining={timeRemaining} />
      </div>

      {turns.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">{languageHint}</p>
        </div>
      )}

      <div className="border rounded-lg p-4 min-h-[200px] bg-white">
        <TranscriptDisplay turns={turns} />
      </div>

      <div className="h-8 flex items-center justify-center">
        <ThinkingIndicator isVisible={showThinking} message={getStatusMessage()} />
        {isPlayingResponse && (
          <span className="text-sm text-primary-600 animate-pulse">Playing...</span>
        )}
      </div>

      <div className="flex justify-center">
        <RecordButton
          isRecording={isRecording}
          isProcessing={isTranscribing || isAiResponding || isGreeting || isPlayingResponse}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          disabled={!canRecord}
        />
      </div>

      <div className="text-center space-y-1">
        {canRecord ? (
          <>
            <p className="text-sm font-medium text-gray-700">
              {isRecording ? 'Release to send' : 'Hold button or spacebar to speak'}
            </p>
            <p className="text-xs text-gray-400">
              Click and hold • Touch and hold • Or press spacebar
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Wait for AI to finish...</p>
        )}
      </div>
    </div>
  );
};
