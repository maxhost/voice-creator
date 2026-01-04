'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePayment } from '@/features/payment';
import { useAppMachine } from '@/app/providers';
import { InterviewPanel } from '@/widgets/interview-panel';
import { OnboardingModal } from '@/widgets/onboarding-modal';
import { LoadingState, ErrorState, UsedState, GeneratingState } from './InterviewStates';
import { generatePosts } from '@/features/post-generation';
import type { UserProfile } from '@/app/model/types';
import { useLanguage, useTranslations } from '@/shared/i18n';

type PageState = 'loading' | 'verifying' | 'onboarding' | 'ready' | 'generating' | 'error' | 'used';

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
  const lang = useLanguage();
  const { interview } = useTranslations(lang);

  const isOnboarding = state.matches('onboarding');
  const isInInterview = state.matches('interview');
  const isGenerating = state.matches('generating');
  const generationStartedRef = useRef(false);

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
    } else if (isGenerating) {
      setPageState('generating');
    }
  }, [isOnboarding, isInInterview, isGenerating]);

  // Trigger generation when entering generating state
  useEffect(() => {
    if (!isGenerating || generationStartedRef.current) return;
    if (!context.userProfile) return;

    generationStartedRef.current = true;

    const runGeneration = async () => {
      const turns = context.interview.turns.map((t) => ({
        speaker: t.speaker,
        transcript: t.transcript,
      }));

      const result = await generatePosts({
        turns,
        userProfile: {
          name: context.userProfile!.name,
          socialNetworks: context.userProfile!.socialNetworks,
          expertise: context.userProfile!.expertise,
        },
      });

      if (result.ok) {
        send({ type: 'GENERATION_COMPLETE', posts: result.data });
      } else {
        send({ type: 'GENERATION_FAILED', error: result.error.message });
      }
    };

    runGeneration();
  }, [isGenerating, context.interview.turns, context.userProfile, send]);

  // Navigate to results when generation is complete
  useEffect(() => {
    if (state.matches('results') && sessionId) {
      completeSession(sessionId, context.generation.posts.length);
      router.push('/results');
    }
  }, [state, sessionId, completeSession, router, context.generation.posts.length]);

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    send({ type: 'COMPLETE_ONBOARDING', userProfile: profile });
  }, [send]);

  const goHome = useCallback(() => router.push('/'), [router]);

  if (pageState === 'loading' || pageState === 'verifying') return <LoadingState />;
  if (pageState === 'generating') return <GeneratingState />;
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
            {context.userProfile?.name
              ? `${interview.page.greeting}, ${context.userProfile.name}`
              : interview.page.paymentVerified}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {interview.page.yourInterview}
          </h1>
        </div>

        <InterviewPanel />
      </div>
    </main>
  );
};
