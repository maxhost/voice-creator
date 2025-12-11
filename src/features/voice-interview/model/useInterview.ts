import { useAppMachine } from '@/app/providers';

export const useInterview = () => {
  const { state, send, context } = useAppMachine();

  const startInterview = (sessionId: string) => {
    send({ type: 'START_INTERVIEW', sessionId });
  };

  const startRecording = () => {
    send({ type: 'START_RECORDING' });
  };

  const stopRecording = (audioBlob: Blob) => {
    send({ type: 'STOP_RECORDING', audioBlob });
  };

  const isWaitingForUser = state.matches('interview.waitingForUser');
  const isRecording = state.matches('interview.recording');
  const isProcessing = state.matches('interview.processing');
  const isAiResponding = state.matches('interview.aiResponding');
  const isPlayingResponse = state.matches('interview.playingResponse');
  const isClosing = state.matches('interview.closing');
  const isFinalResponse = state.matches('interview.finalResponse');

  return {
    turns: context.interview.turns,
    topics: context.interview.topics,
    timeRemaining: context.interview.timeRemaining,
    lastSpeaker: context.interview.lastSpeaker,
    isWaitingForUser,
    isRecording,
    isProcessing,
    isAiResponding,
    isPlayingResponse,
    isClosing,
    isFinalResponse,
    startInterview,
    startRecording,
    stopRecording,
  };
};
