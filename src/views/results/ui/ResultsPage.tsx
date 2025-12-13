'use client';

import { useAppMachine } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ResultsPanel } from '@/widgets/results-panel';

export const ResultsPage = () => {
  const { state } = useAppMachine();
  const router = useRouter();

  // Guard: redirect if not authorized
  useEffect(() => {
    if (!state.matches('results')) {
      router.push('/');
    }
  }, [state, router]);

  // Show loading while checking authorization
  if (!state.matches('results')) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <ResultsPanel />
    </main>
  );
};
