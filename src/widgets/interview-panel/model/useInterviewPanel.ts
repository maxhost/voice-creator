'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useVoiceFlow, useAudioRecording } from '@/features/voice-interview';

export const useInterviewPanel = () => {
  const {
    userProfile,
    turns,
    timeRemaining,
    currentAudioUrl,
    isInInterview,
    isGreeting,
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
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayedAudioRef = useRef<string | null>(null);

  const canRecord = isWaitingForUser && !isTranscribing && !isAiResponding && !isPlayingResponse;

  // Start timer when interview begins (runs continuously during entire interview)
  useEffect(() => {
    if (!isInInterview) {
      // Clear timer if we leave interview state
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    if (timerIntervalRef.current) return; // Already running

    timerIntervalRef.current = setInterval(() => {
      onTimerTick();
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isInInterview, onTimerTick]);

  // Check for timer end
  useEffect(() => {
    if (timeRemaining <= 0 && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      onTimerEnd();
    }
  }, [timeRemaining, onTimerEnd]);

  // Play greeting when interview starts (in greeting state, only once)
  useEffect(() => {
    if (isGreeting && !greetingPlayedRef.current && userProfile) {
      greetingPlayedRef.current = true;
      playGreeting();
    }
  }, [isGreeting, playGreeting, userProfile]);

  const handleStartRecording = useCallback(async () => {
    if (!canRecord) return;
    await startAudioRecording();
    machineStartRecording();
  }, [canRecord, startAudioRecording, machineStartRecording]);

  const handleStopRecording = useCallback(async () => {
    const blob = await stopAudioRecording();
    if (blob && !isProcessingRef.current) {
      isProcessingRef.current = true;
      try {
        machineStopRecording(blob);
        await processRecording(blob);
      } finally {
        isProcessingRef.current = false;
      }
    }
  }, [stopAudioRecording, machineStopRecording, processRecording]);

  // Auto-play AI response when ready (only once per URL)
  useEffect(() => {
    if (isPlayingResponse && currentAudioUrl && currentAudioUrl !== lastPlayedAudioRef.current) {
      lastPlayedAudioRef.current = currentAudioUrl;
      playAudio(currentAudioUrl);
    }
  }, [isPlayingResponse, currentAudioUrl, playAudio]);

  return {
    turns,
    timeRemaining,
    isGreeting,
    isRecording: audioIsRecording || machineIsRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    canRecord,
    handleStartRecording,
    handleStopRecording,
  };
};
