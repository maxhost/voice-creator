'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

  const {
    isRecording: audioIsRecording,
    micPermission,
    error: micError,
    requestMicPermission,
    start: startAudioRecording,
    stop: stopAudioRecording,
  } = useAudioRecording();

  const isProcessingRef = useRef(false);
  const greetingPlayedRef = useRef(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayedAudioRef = useRef<string | null>(null);
  const timerEndedRef = useRef(false);
  const micPermissionRequestedRef = useRef(false);

  // Can only start new recording if time remaining and in waiting state
  const canRecord = isWaitingForUser && !isTranscribing && !isAiResponding && !isPlayingResponse && timeRemaining > 0;

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
    if (timeRemaining <= 0 && !timerEndedRef.current) {
      // Clear the interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      timerEndedRef.current = true;

      // If user is currently recording, we'll handle the end after they stop
      // The recording will be processed and then we'll transition to generating
      if (!audioIsRecording && !machineIsRecording && !isTranscribing && !isAiResponding && !isPlayingResponse) {
        onTimerEnd();
      }
    }
  }, [timeRemaining, audioIsRecording, machineIsRecording, isTranscribing, isAiResponding, isPlayingResponse, onTimerEnd]);

  // If timer ended while user was recording/processing, end interview when done
  useEffect(() => {
    if (timerEndedRef.current && isWaitingForUser && !audioIsRecording && !machineIsRecording && !isTranscribing && !isAiResponding && !isPlayingResponse) {
      onTimerEnd();
    }
  }, [isWaitingForUser, audioIsRecording, machineIsRecording, isTranscribing, isAiResponding, isPlayingResponse, onTimerEnd]);

  // Request microphone permission when interview starts
  useEffect(() => {
    if (isInInterview && !micPermissionRequestedRef.current) {
      micPermissionRequestedRef.current = true;
      requestMicPermission();
    }
  }, [isInInterview, requestMicPermission]);

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

  const isTimeUp = timeRemaining <= 0;

  return {
    turns,
    timeRemaining,
    isGreeting,
    isRecording: audioIsRecording || machineIsRecording,
    isTranscribing,
    isAiResponding,
    isPlayingResponse,
    isTimeUp,
    canRecord,
    micPermission,
    micError,
    handleStartRecording,
    handleStopRecording,
  };
};
