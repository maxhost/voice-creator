'use client';

import { useState, useCallback, useRef } from 'react';
import type { RecordingState } from './types';

export const useAudioRecording = () => {
  const [state, setState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.start(1000); // Chunk every 1s
      setState('recording');
      isRecordingRef.current = true;
    } catch (err) {
      setError('No se pudo acceder al micrófono');
      setState('idle');
    }
  }, []);

  const stop = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || !isRecordingRef.current) {
        resolve(null);
        return;
      }

      isRecordingRef.current = false;
      setState('processing');

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];

        // Stop all tracks to release microphone
        mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());

        setState('idle');
        resolve(blob);
      };

      mediaRecorder.current.stop();
    });
  }, []);

  return {
    state,
    error,
    isRecording: state === 'recording',
    isProcessing: state === 'processing',
    start,
    stop,
  };
};
