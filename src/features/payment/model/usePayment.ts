import { useState, useCallback } from 'react';
import { createCheckout, verifySession, markSessionUsed } from '../api';
import type { PaymentState } from './types';

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  sessionId: null,
  status: 'idle',
};

export const usePayment = () => {
  const [state, setState] = useState<PaymentState>(initialState);

  const initiateCheckout = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null, status: 'redirecting' }));
    const result = await createCheckout();
    if (!result.ok) {
      setState((s) => ({ ...s, isLoading: false, error: result.error.message, status: 'error' }));
      return;
    }
    window.location.href = result.data.url;
  }, []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null, status: 'verifying' }));
    const result = await verifySession(sessionId);
    if (!result.ok) {
      const status = result.error.code === 'SESSION_USED' ? 'used' : 'error';
      setState((s) => ({ ...s, isLoading: false, error: result.error.message, status }));
      return false;
    }
    setState({ isLoading: false, error: null, sessionId: result.data.sessionId, status: 'paid' });
    return true;
  }, []);

  const completeSession = useCallback(async (sessionId: string, ideasGenerated: number) => {
    const result = await markSessionUsed({ sessionId, ideasGenerated });
    if (!result.ok) console.error('Failed to mark session:', result.error.message);
    setState((s) => ({ ...s, status: 'used' }));
  }, []);

  return { ...state, initiateCheckout, verifyPayment, completeSession };
};
