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

const TIME_UP_MESSAGE: Record<string, string> = {
  es: 'El tiempo ha terminado. Espera un momento mientras generamos tus ideas...',
  en: 'Time is up. Please wait while we generate your ideas...',
  fr: 'Le temps est écoulé. Veuillez patienter pendant que nous générons vos idées...',
  de: 'Die Zeit ist abgelaufen. Bitte warten Sie, während wir Ihre Ideen generieren...',
  pt: 'O tempo acabou. Aguarde enquanto geramos suas ideias...',
  it: 'Il tempo è scaduto. Attendi mentre generiamo le tue idee...',
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
    isTimeUp,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  } = useInterviewPanel();

  const showThinking = isGreeting || isTranscribing || isAiResponding;
  const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
  const languageHint = LANGUAGE_HINT[browserLang] || LANGUAGE_HINT.en;
  const timeUpMessage = TIME_UP_MESSAGE[browserLang] || TIME_UP_MESSAGE.en;

  const getStatusMessage = () => {
    if (isGreeting) return 'Preparing greeting...';
    if (isTranscribing) return 'Transcribing...';
    if (isAiResponding) return 'Generating response...';
    return '';
  };

  // Show time up message when interview ends
  if (isTimeUp && !isRecording && !isTranscribing && !isAiResponding && !isPlayingResponse) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <TimerDisplay timeRemaining={0} />
        </div>

        <div className="border rounded-lg p-4 min-h-[200px] bg-white">
          <TranscriptDisplay turns={turns} />
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-primary-700 font-medium">{timeUpMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <TimerDisplay timeRemaining={timeRemaining} />
      </div>

      {turns.length === 0 && !isTimeUp && (
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
        {isTimeUp ? (
          <p className="text-sm text-amber-600 font-medium">
            {isRecording ? 'Finish your message...' : 'Processing final response...'}
          </p>
        ) : canRecord ? (
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
