'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useVoiceFlow, useAudioRecording } from '@/features/voice-interview';

export const useInterviewPanel = () => {
  const {
    turns,
    timeRemaining,
    currentAudioUrl,
    isWaitingForUser,
    isRecording: machineIsRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    startRecording: machineStartRecording,
    stopRecording: machineStopRecording,
    processRecording,
    playAudio,
  } = useVoiceFlow();

  const { isRecording: audioIsRecording, start: startAudioRecording, stop: stopAudioRecording } = useAudioRecording();
  const isProcessingRef = useRef(false);

  const canRecord = isWaitingForUser && !isTranscribing && !isAiResponding && !isPlayingResponse;

  const handleStartRecording = useCallback(async () => {
    if (!canRecord) return;
    await startAudioRecording();
    machineStartRecording();
  }, [canRecord, startAudioRecording, machineStartRecording]);

  const handleStopRecording = useCallback(async () => {
    const blob = await stopAudioRecording();
    if (blob && !isProcessingRef.current) {
      isProcessingRef.current = true;
      machineStopRecording(blob);
      await processRecording(blob);
      isProcessingRef.current = false;
    }
  }, [stopAudioRecording, machineStopRecording, processRecording]);

  // Auto-play AI response when ready
  useEffect(() => {
    if (isPlayingResponse && currentAudioUrl) {
      playAudio(currentAudioUrl);
    }
  }, [isPlayingResponse, currentAudioUrl, playAudio]);

  return {
    turns,
    timeRemaining,
    isRecording: audioIsRecording || machineIsRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  };
};
