'use client';

import type { PaymentStatus as PaymentStatusType } from '../model/types';
import { useLanguage, getTranslation, payment } from '@/shared/i18n';

type PaymentStatusProps = {
  status: PaymentStatusType;
  error?: string | null;
};

export const PaymentStatus = ({ status, error }: PaymentStatusProps) => {
  const lang = useLanguage();

  if (status === 'idle') return null;

  return (
    <div className="text-center">
      {status === 'redirecting' && (
        <p className="text-gray-500">
          {getTranslation(payment.status.redirecting, lang)}
        </p>
      )}
      {status === 'verifying' && (
        <p className="text-gray-500">
          {getTranslation(payment.status.verifying, lang)}
        </p>
      )}
      {status === 'paid' && (
        <p className="text-green-600">
          {getTranslation(payment.status.confirmed, lang)}
        </p>
      )}
      {status === 'used' && (
        <p className="text-yellow-600">
          {getTranslation(payment.status.sessionUsed, lang)}
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600">
          {error || getTranslation(payment.status.error, lang)}
        </p>
      )}
    </div>
  );
};
