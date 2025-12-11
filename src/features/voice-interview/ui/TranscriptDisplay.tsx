'use client';

import type { Turn } from '@/entities/interview-session';

type TranscriptDisplayProps = {
  turns: Turn[];
  maxHeight?: string;
};

export const TranscriptDisplay = ({
  turns,
  maxHeight = '300px',
}: TranscriptDisplayProps) => {
  if (turns.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        La conversación aparecerá aquí
      </div>
    );
  }

  return (
    <div
      className="space-y-4 overflow-y-auto"
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
            {turn.speaker === 'user' ? 'Tú' : 'IA'}
          </div>
          <p className="text-sm">{turn.transcript}</p>
        </div>
      ))}
    </div>
  );
};
