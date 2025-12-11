'use client';

type AudioVisualizerProps = {
  isActive: boolean;
};

export const AudioVisualizer = ({ isActive }: AudioVisualizerProps) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary-500 rounded-full transition-all duration-150
                      ${isActive ? 'animate-pulse' : ''}`}
          style={{
            height: isActive ? `${Math.random() * 100}%` : '20%',
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
};
