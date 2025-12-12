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
    playGreeting,
    onTimerTick,
    onTimerEnd,
  } = useVoiceFlow();

  const { isRecording: audioIsRecording, start: startAudioRecording, stop: stopAudioRecording } = useAudioRecording();
  const isProcessingRef = useRef(false);
  const greetingPlayedRef = useRef(false);
  const timerStartedRef = useRef(false);

  const canRecord = isWaitingForUser && !isTranscribing && !isAiResponding && !isPlayingResponse;

  // Start timer when interview begins
  useEffect(() => {
    if (!isWaitingForUser || timerStartedRef.current) return;
    timerStartedRef.current = true;

    const interval = setInterval(() => {
      onTimerTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isWaitingForUser, onTimerTick]);

  // Check for timer end
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimerEnd();
    }
  }, [timeRemaining, onTimerEnd]);

  // Play greeting when interview starts (only once)
  useEffect(() => {
    if (isWaitingForUser && turns.length === 0 && !greetingPlayedRef.current) {
      greetingPlayedRef.current = true;
      playGreeting();
    }
  }, [isWaitingForUser, turns.length, playGreeting]);

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
