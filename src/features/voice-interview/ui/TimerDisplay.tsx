'use client';

import { formatTime } from '@/shared/lib';
import { TIMER_WARNING_THRESHOLD_SECONDS } from '@/shared/config/constants';

type TimerDisplayProps = {
  timeRemaining: number;
};

export const TimerDisplay = ({ timeRemaining }: TimerDisplayProps) => {
  const isWarning = timeRemaining <= TIMER_WARNING_THRESHOLD_SECONDS;

  return (
    <div
      className={`text-6xl font-mono font-bold transition-colors
                  ${isWarning ? 'text-red-500' : 'text-primary-600'}`}
    >
      {formatTime(timeRemaining)}
    </div>
  );
};
