'use client';

import { useLanguage, useTranslations } from '@/shared/i18n';

type PaymentButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const PaymentButton = ({
  onClick,
  disabled = false,
  loading = false,
}: PaymentButtonProps) => {
  const lang = useLanguage();
  const { payment } = useTranslations(lang);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white
                 font-semibold rounded-lg text-lg transition-default
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? payment.button.processing : `${payment.button.start} - $5`}
    </button>
  );
};
