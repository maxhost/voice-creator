'use client';

import { useState, useCallback, useRef } from 'react';
import type { RecordingState } from './types';

export type MicPermissionStatus = 'unknown' | 'granted' | 'denied' | 'prompt';

export const useAudioRecording = () => {
  const [state, setState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<MicPermissionStatus>('unknown');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);

  // Request microphone permission explicitly
  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      // First check current permission state if available
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setMicPermission('denied');
          setError('Permiso de micrófono denegado. Por favor habilítalo en la configuración del navegador.');
          return false;
        }
      }

      // Request actual permission by getting the stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop the stream - we just wanted to request permission
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
      setError(null);
      return true;
    } catch (err) {
      setMicPermission('denied');
      setError('No se pudo acceder al micrófono. Por favor permite el acceso en tu navegador.');
      return false;
    }
  }, []);

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
      setMicPermission('granted');
    } catch (err) {
      setMicPermission('denied');
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
    micPermission,
    isRecording: state === 'recording',
    isProcessing: state === 'processing',
    requestMicPermission,
    start,
    stop,
  };
};
