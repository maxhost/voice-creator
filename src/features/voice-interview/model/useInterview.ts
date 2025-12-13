import { useAppMachine } from '@/app/providers';

export const useInterview = () => {
  const { state, send, context } = useAppMachine();

  const startRecording = () => send({ type: 'START_RECORDING' });
  const stopRecording = (audioBlob: Blob) => send({ type: 'STOP_RECORDING', audioBlob });

  const onTranscriptionComplete = (transcript: string, topics: string[]) => {
    send({ type: 'TRANSCRIPTION_COMPLETE', transcript, topics });
  };

  const onAIResponseReady = (response: string, audioUrl: string) => {
    send({ type: 'AI_RESPONSE_READY', response, audioUrl });
  };

  const onAudioComplete = () => send({ type: 'AUDIO_PLAYBACK_COMPLETE' });
  const onTimerTick = () => send({ type: 'TIMER_TICK' });
  const onTimerEnd = () => send({ type: 'TIMER_END' });

  const setError = (error: { code: string; message: string; retryable: boolean }) => {
    send({ type: 'SET_ERROR', error });
  };

  return {
    turns: context.interview.turns,
    topics: context.interview.topics,
    timeRemaining: context.interview.timeRemaining,
    lastSpeaker: context.interview.lastSpeaker,
    currentAudioUrl: context.interview.currentAudioUrl,
    isInInterview: state.matches('interview'),
    isWaitingForUser: state.matches('interview.waitingForUser'),
    isRecording: state.matches('interview.recording'),
    isTranscribing: state.matches('interview.transcribing'),
    isAiResponding: state.matches('interview.aiResponding'),
    isPlayingResponse: state.matches('interview.playingResponse'),
    isClosing: state.matches('interview.closing'),
    isFinalResponse: state.matches('interview.finalResponse'),
    startRecording,
    stopRecording,
    onTranscriptionComplete,
    onAIResponseReady,
    onAudioComplete,
    onTimerTick,
    onTimerEnd,
    setError,
  };
};
