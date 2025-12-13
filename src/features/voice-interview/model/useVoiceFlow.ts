import { useCallback } from 'react';
import { useInterview } from './useInterview';
import { transcribeAudio, generateAIResponse, textToSpeech, fetchGreeting } from '../api';

/**
 * Hook that orchestrates the complete voice flow:
 * Greeting → Recording → Transcription → AI Response → TTS → Playback
 */
export const useVoiceFlow = () => {
  const interview = useInterview();
  const {
    userProfile,
    turns,
    onTranscriptionComplete,
    onAIResponseReady,
    onAudioComplete,
    setError,
  } = interview;

  const playGreeting = useCallback(async () => {
    if (!userProfile) {
      setError({ code: 'GREETING_FAILED', message: 'User profile not found', retryable: false });
      return;
    }

    const result = await fetchGreeting(userProfile);
    if (!result.ok) {
      setError({ code: 'GREETING_FAILED', message: result.error.message, retryable: false });
      return;
    }

    const { audioBlob, greeting } = result.data;
    const audioUrl = URL.createObjectURL(audioBlob);

    // Add greeting to conversation as AI turn
    onAIResponseReady(greeting, audioUrl);
  }, [userProfile, onAIResponseReady, setError]);

  const processRecording = useCallback(async (audioBlob: Blob) => {
    // Step 1: Transcribe audio
    const transcribeResult = await transcribeAudio(audioBlob);
    if (!transcribeResult.ok) {
      setError({ code: 'TRANSCRIPTION_FAILED', message: transcribeResult.error.message, retryable: true });
      return;
    }

    const { transcript } = transcribeResult.data;

    // Step 2: Generate AI response
    const conversationHistory = turns.map((t) => ({
      role: t.speaker === 'user' ? 'user' as const : 'ai' as const,
      content: t.transcript,
    }));
    const aiResult = await generateAIResponse({
      transcript,
      conversationHistory,
      userProfile: userProfile || undefined,
    });
    if (!aiResult.ok) {
      setError({ code: 'AI_RESPONSE_FAILED', message: aiResult.error.message, retryable: true });
      return;
    }

    const { response, topics, language } = aiResult.data;

    // Update state with transcript and topics
    onTranscriptionComplete(transcript, topics);

    // Step 3: Convert to speech (with language-specific voice)
    const ttsResult = await textToSpeech(response, language);
    if (!ttsResult.ok) {
      setError({ code: 'TTS_FAILED', message: ttsResult.error.message, retryable: true });
      return;
    }

    // Create audio URL and notify state machine
    const audioUrl = URL.createObjectURL(ttsResult.data);
    onAIResponseReady(response, audioUrl);
  }, [turns, userProfile, onTranscriptionComplete, onAIResponseReady, setError]);

  const playAudio = useCallback((audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      onAudioComplete();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      setError({ code: 'TTS_FAILED', message: 'Audio playback failed', retryable: false });
    };
    audio.play().catch(() => {
      setError({ code: 'TTS_FAILED', message: 'Could not play audio', retryable: false });
    });
  }, [onAudioComplete, setError]);

  return {
    ...interview,
    playGreeting,
    processRecording,
    playAudio,
  };
};
