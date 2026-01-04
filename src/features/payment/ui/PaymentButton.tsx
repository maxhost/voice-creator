'use client';

import { useLanguage, getTranslation, payment } from '@/shared/i18n';

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

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white
                 font-semibold rounded-lg text-lg transition-default
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? getTranslation(payment.button.processing, lang) : `${getTranslation(payment.button.start, lang)} - $5`}
    </button>
  );
};
