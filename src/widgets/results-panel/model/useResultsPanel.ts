'use client';

import { useState, useCallback } from 'react';
import { usePostGeneration } from '@/features/post-generation';
import { generatePdf } from '@/features/pdf-export';
import { formatTimeHuman } from '@/shared/lib';
import { INTERVIEW_DURATION_SECONDS } from '@/shared/config/constants';

export const useResultsPanel = () => {
  const { posts } = usePostGeneration();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (posts.length === 0) return;

    setIsDownloading(true);

    try {
      const blob = await generatePdf({
        posts,
        interviewDuration: formatTimeHuman(INTERVIEW_DURATION_SECONDS),
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-creator-ideas-${Date.now()}.txt`; // Will be .pdf when implemented
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }, [posts]);

  return {
    posts,
    isDownloading,
    handleDownload,
  };
};
