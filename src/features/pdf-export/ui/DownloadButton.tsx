'use client';

import { useLanguage, getTranslation, results } from '@/shared/i18n';

type DownloadButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const DownloadButton = ({
  onClick,
  disabled = false,
  loading = false,
}: DownloadButtonProps) => {
  const lang = useLanguage();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white
                 font-semibold rounded-lg transition-default
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin">↻</span>
          {getTranslation(results.pdf.generating, lang)}
        </>
      ) : (
        <>
          <span>↓</span>
          {getTranslation(results.pdf.download, lang)}
        </>
      )}
    </button>
  );
};
