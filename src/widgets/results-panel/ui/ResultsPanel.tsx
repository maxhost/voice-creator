'use client';

import { PostList } from '@/features/post-generation';
import { DownloadButton } from '@/features/pdf-export';
import { useResultsPanel } from '../model/useResultsPanel';

export const ResultsPanel = () => {
  const {
    posts,
    isDownloading,
    isRedirecting,
    handleDownload,
    handleNewInterview,
  } = useResultsPanel();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Tus Ideas de Contenido</h1>
        <p className="text-gray-600">
          {posts.length} {posts.length === 1 ? 'idea generada' : 'ideas generadas'} basadas en tu entrevista
        </p>
      </div>

      {/* Posts grid */}
      <PostList posts={posts} />

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <DownloadButton
          onClick={handleDownload}
          loading={isDownloading}
          disabled={posts.length === 0}
        />
        <button
          onClick={handleNewInterview}
          disabled={isRedirecting}
          className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600
                     font-semibold rounded-lg transition-all hover:bg-primary-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          {isRedirecting ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              Redirigiendo...
            </>
          ) : (
            <>
              <span>+</span>
              Nueva Entrevista
            </>
          )}
        </button>
      </div>
    </div>
  );
};
