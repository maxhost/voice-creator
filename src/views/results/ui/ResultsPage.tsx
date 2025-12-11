'use client';

import { useAppMachine } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Tus Ideas de Contenido</h1>
          <p className="text-gray-500">
            Basadas en tu entrevista de 10 minutos
          </p>
        </div>

        {/* Posts grid placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="text-sm text-primary-600 font-medium">
                LinkedIn
              </div>
              <h3 className="text-lg font-semibold">
                Idea de post #{i}
              </h3>
              <p className="text-gray-600 text-sm">
                Descripción del post placeholder...
              </p>
            </div>
          ))}
        </div>

        {/* Download button */}
        <div className="flex justify-center pt-8">
          <button
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white
                       font-semibold rounded-lg transition-default"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </main>
  );
};
