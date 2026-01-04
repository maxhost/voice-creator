'use client';

import { useEffect, useRef } from 'react';
import { useLanguage, getTranslation } from '@/shared/i18n';
import { interview } from '@/shared/i18n';
import type { Turn } from '@/entities/interview-session';

type TranscriptDisplayProps = {
  turns: Turn[];
  maxHeight?: string;
};

export const TranscriptDisplay = ({
  turns,
  maxHeight = '300px',
}: TranscriptDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lang = useLanguage();

  // Auto-scroll to bottom when new turns are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [turns.length]);

  if (turns.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        {getTranslation(interview.transcript.placeholder, lang)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-4 overflow-y-auto scroll-smooth"
      style={{ maxHeight }}
    >
      {turns.map((turn) => (
        <div
          key={turn.id}
          className={`p-3 rounded-lg ${
            turn.speaker === 'user'
              ? 'bg-primary-50 ml-8'
              : 'bg-gray-100 mr-8'
          }`}
        >
          <div className="text-xs text-gray-500 mb-1">
            {turn.speaker === 'user'
              ? getTranslation(interview.transcript.you, lang)
              : getTranslation(interview.transcript.ai, lang)}
          </div>
          <p className="text-sm text-gray-900">{turn.transcript}</p>
        </div>
      ))}
    </div>
  );
};
