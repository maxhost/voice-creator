import { Suspense } from 'react';
import { InterviewPage } from '@/views/interview/ui/InterviewPage';

function InterviewLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </main>
  );
}

export default function Interview() {
  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewPage />
    </Suspense>
  );
}
