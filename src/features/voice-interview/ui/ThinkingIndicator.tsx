'use client';

type ThinkingIndicatorProps = {
  isVisible: boolean;
  message?: string;
};

export const ThinkingIndicator = ({
  isVisible,
  message = 'Pensando...',
}: ThinkingIndicatorProps) => {
  if (!isVisible) return null;

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
      <span className="text-sm">{message}</span>
    </div>
  );
};
