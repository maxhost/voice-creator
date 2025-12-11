'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePayment } from '@/features/payment';
import { useAppMachine } from '@/app/providers';
import { LoadingState, ErrorState, UsedState } from './InterviewStates';

type PageState = 'loading' | 'verifying' | 'ready' | 'error' | 'used';

const MAX_RETRIES = 10;
const RETRY_DELAY = 1500; // 1.5 seconds

export const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { send } = useAppMachine();
  const { verifyPayment, completeSession, error } = usePayment();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const verificationStarted = useRef(false);

  useEffect(() => {
    const id = searchParams.get('session_id');
    if (!id) { router.push('/'); return; }
    if (verificationStarted.current) return;

    verificationStarted.current = true;
    setSessionId(id);
    setPageState('verifying');

    let retries = 0;
    const verify = async (): Promise<void> => {
      const result = await verifyPayment(id);

      if (result) {
        setPageState('ready');
        send({ type: 'START_INTERVIEW', sessionId: id });
        return;
      }

      // If payment pending and retries left, try again
      retries++;
      if (retries < MAX_RETRIES) {
        setTimeout(verify, RETRY_DELAY);
      } else {
        setPageState('error');
      }
    };

    verify();
  }, [searchParams, router, verifyPayment, send]);

  const handleComplete = useCallback((ideasGenerated: number = 0) => {
    if (sessionId) {
      completeSession(sessionId, ideasGenerated);
      router.push(`/results?session_id=${sessionId}`);
    }
  }, [sessionId, completeSession, router]);

  const goHome = useCallback(() => router.push('/'), [router]);

  if (pageState === 'loading' || pageState === 'verifying') return <LoadingState />;
  if (pageState === 'used') return <UsedState onBuyNew={goHome} />;
  if (pageState === 'error') return <ErrorState error={error} onBack={goHome} />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block">
          Pago verificado
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tu Entrevista</h1>
        <div className="text-6xl font-mono font-bold text-primary-600">10:00</div>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <p className="text-gray-500">Interview Panel se renderizará aquí</p>
        </div>
        <div className="flex justify-center">
          <button className="w-24 h-24 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-default shadow-lg">
            REC
          </button>
        </div>
        <button onClick={() => handleComplete(5)} className="mt-8 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-default">
          [DEV] Completar entrevista (5 ideas)
        </button>
      </div>
    </main>
  );
};
