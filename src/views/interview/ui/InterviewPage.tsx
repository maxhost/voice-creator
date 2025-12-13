'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePayment } from '@/features/payment';
import { useAppMachine } from '@/app/providers';
import { InterviewPanel } from '@/widgets/interview-panel';
import { OnboardingModal } from '@/widgets/onboarding-modal';
import { LoadingState, ErrorState, UsedState } from './InterviewStates';
import type { UserProfile } from '@/app/model/types';

type PageState = 'loading' | 'verifying' | 'onboarding' | 'ready' | 'error' | 'used';

const MAX_RETRIES = 10;
const RETRY_DELAY = 1500;

export const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, send, context } = useAppMachine();
  const { verifyPayment, completeSession, error } = usePayment();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const verificationStarted = useRef(false);

  const isOnboarding = state.matches('onboarding');
  const isInInterview = state.matches('interview');

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
        setPageState('onboarding');
        send({ type: 'START_INTERVIEW', sessionId: id });
        return;
      }
      retries++;
      if (retries < MAX_RETRIES) setTimeout(verify, RETRY_DELAY);
      else setPageState('error');
    };
    verify();
  }, [searchParams, router, verifyPayment, send]);

  // Sync page state with machine state
  useEffect(() => {
    if (isOnboarding) {
      setPageState('onboarding');
    } else if (isInInterview) {
      setPageState('ready');
    }
  }, [isOnboarding, isInInterview]);

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    send({ type: 'COMPLETE_ONBOARDING', userProfile: profile });
  }, [send]);

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

  if (pageState === 'onboarding' || isOnboarding) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <OnboardingModal onComplete={handleOnboardingComplete} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            {context.userProfile?.name ? `Hola, ${context.userProfile.name}` : 'Pago verificado'}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Tu Entrevista</h1>
        </div>

        <InterviewPanel />

        <button
          onClick={() => handleComplete(5)}
          className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
        >
          [DEV] Completar entrevista (5 ideas)
        </button>
      </div>
    </main>
  );
};
