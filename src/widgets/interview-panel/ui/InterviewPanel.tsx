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

// Status banner component
const StatusBanner = ({
  type,
  children
}: {
  type: 'your-turn' | 'ai-speaking' | 'processing';
  children: React.ReactNode
}) => {
  const styles = {
    'your-turn': 'bg-green-100 border-green-400 text-green-800',
    'ai-speaking': 'bg-blue-100 border-blue-400 text-blue-800',
    'processing': 'bg-amber-100 border-amber-400 text-amber-800',
  };

  const icons = {
    'your-turn': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
      </svg>
    ),
    'ai-speaking': (
      <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
      </svg>
    ),
    'processing': (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
  };

  return (
    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm">{children}</span>
    </div>
  );
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

  const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
  const languageHint = LANGUAGE_HINT[browserLang] || LANGUAGE_HINT.en;
  const timeUpMessage = TIME_UP_MESSAGE[browserLang] || TIME_UP_MESSAGE.en;

  // Determine current status
  const getStatus = (): 'your-turn' | 'recording' | 'ai-speaking' | 'processing' | 'time-up' => {
    if (isTimeUp && !isRecording && !isTranscribing && !isAiResponding && !isPlayingResponse) return 'time-up';
    if (isRecording) return 'recording';
    if (isPlayingResponse) return 'ai-speaking';
    if (isGreeting || isTranscribing || isAiResponding) return 'processing';
    return 'your-turn';
  };

  const status = getStatus();

  // Status messages in user's language
  const statusMessages: Record<string, Record<string, string>> = {
    'your-turn': {
      es: 'Tu turno - Mantén presionado para hablar',
      en: 'Your turn - Hold to speak',
      fr: 'Votre tour - Maintenez pour parler',
      de: 'Dein Zug - Gedrückt halten zum Sprechen',
      pt: 'Sua vez - Segure para falar',
      it: 'Il tuo turno - Tieni premuto per parlare',
    },
    'recording': {
      es: 'Grabando... Suelta para enviar',
      en: 'Recording... Release to send',
      fr: 'Enregistrement... Relâchez pour envoyer',
      de: 'Aufnahme... Loslassen zum Senden',
      pt: 'Gravando... Solte para enviar',
      it: 'Registrazione... Rilascia per inviare',
    },
    'ai-speaking': {
      es: 'La IA está hablando...',
      en: 'AI is speaking...',
      fr: "L'IA parle...",
      de: 'KI spricht...',
      pt: 'A IA está falando...',
      it: "L'IA sta parlando...",
    },
    'processing': {
      es: 'Procesando...',
      en: 'Processing...',
      fr: 'Traitement...',
      de: 'Verarbeitung...',
      pt: 'Processando...',
      it: 'Elaborazione...',
    },
  };

  // Show time up message when interview ends
  if (status === 'time-up') {
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

      {/* Status Banner - Always visible */}
      <div className="flex justify-center">
        {status === 'your-turn' && (
          <StatusBanner type="your-turn">
            {statusMessages['your-turn'][browserLang] || statusMessages['your-turn'].en}
          </StatusBanner>
        )}
        {status === 'recording' && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 bg-red-100 border-red-400 text-red-800">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium text-sm">
              {statusMessages['recording'][browserLang] || statusMessages['recording'].en}
            </span>
          </div>
        )}
        {status === 'ai-speaking' && (
          <StatusBanner type="ai-speaking">
            {statusMessages['ai-speaking'][browserLang] || statusMessages['ai-speaking'].en}
          </StatusBanner>
        )}
        {status === 'processing' && (
          <StatusBanner type="processing">
            {statusMessages['processing'][browserLang] || statusMessages['processing'].en}
          </StatusBanner>
        )}
      </div>

      {turns.length === 0 && !isTimeUp && status === 'your-turn' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">{languageHint}</p>
        </div>
      )}

      <div className="border rounded-lg p-4 min-h-[200px] bg-white">
        <TranscriptDisplay turns={turns} />
      </div>

      {/* Record Button with visual indicator */}
      <div className="flex justify-center">
        <div className={`relative ${status === 'your-turn' ? 'animate-pulse' : ''}`}>
          {status === 'your-turn' && (
            <div className="absolute inset-0 -m-2 rounded-full border-4 border-green-400 animate-ping opacity-75" />
          )}
          <RecordButton
            isRecording={isRecording}
            isProcessing={isTranscribing || isAiResponding || isGreeting || isPlayingResponse}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            disabled={!canRecord}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          {browserLang === 'es' ? 'Click y mantén • Toca y mantén • O presiona espacio' :
           'Click and hold • Touch and hold • Or press spacebar'}
        </p>
      </div>
    </div>
  );
};
