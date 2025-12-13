'use client';

import { PostList } from '@/features/post-generation';
import { DownloadButton } from '@/features/pdf-export';
import { useResultsPanel } from '../model/useResultsPanel';

export const ResultsPanel = () => {
  const {
    posts,
    isDownloading,
    handleDownload,
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

      {/* Download button */}
      <div className="flex justify-center pt-8">
        <DownloadButton
          onClick={handleDownload}
          loading={isDownloading}
          disabled={posts.length === 0}
        />
      </div>
    </div>
  );
};
