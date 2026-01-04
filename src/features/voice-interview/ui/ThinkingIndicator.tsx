'use client';

import { useLanguage, getTranslation } from '@/shared/i18n';
import { interview } from '@/shared/i18n';

type ThinkingIndicatorProps = {
  isVisible: boolean;
  message?: string;
};

export const ThinkingIndicator = ({
  isVisible,
  message,
}: ThinkingIndicatorProps) => {
  const lang = useLanguage();

  if (!isVisible) return null;

  const displayMessage = message || getTranslation(interview.thinking, lang);

  return (
    <div className="flex items-center justify-center gap-2 text-gray-500">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="text-sm">{displayMessage}</span>
    </div>
  );
};
