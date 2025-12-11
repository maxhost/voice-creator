'use client';

import { useCallback } from 'react';
import { useInterview, useAudioRecording } from '@/features/voice-interview';

export const useInterviewPanel = () => {
  const {
    turns,
    timeRemaining,
    isWaitingForUser,
    isRecording: machineIsRecording,
    isProcessing,
    isAiResponding,
    isPlayingResponse,
    startRecording: machineStartRecording,
    stopRecording: machineStopRecording,
  } = useInterview();

  const {
    isRecording: audioIsRecording,
    start: startAudioRecording,
    stop: stopAudioRecording,
  } = useAudioRecording();

  const canRecord = isWaitingForUser && !isProcessing && !isAiResponding && !isPlayingResponse;

  const handleStartRecording = useCallback(async () => {
    if (!canRecord) return;
    await startAudioRecording();
    machineStartRecording();
  }, [canRecord, startAudioRecording, machineStartRecording]);

  const handleStopRecording = useCallback(async () => {
    const blob = await stopAudioRecording();
    if (blob) {
      machineStopRecording(blob);
    }
  }, [stopAudioRecording, machineStopRecording]);

  return {
    turns,
    timeRemaining,
    isRecording: audioIsRecording || machineIsRecording,
    isProcessing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  };
};
