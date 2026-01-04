'use client';

import type { PaymentStatus as PaymentStatusType } from '../model/types';
import { useLanguage, useTranslations } from '@/shared/i18n';

type PaymentStatusProps = {
  status: PaymentStatusType;
  error?: string | null;
};

export const PaymentStatus = ({ status, error }: PaymentStatusProps) => {
  const lang = useLanguage();
  const { payment } = useTranslations(lang);

  if (status === 'idle') return null;

  return (
    <div className="text-center">
      {status === 'redirecting' && (
        <p className="text-gray-500">
          {payment.status.redirecting}
        </p>
      )}
      {status === 'verifying' && (
        <p className="text-gray-500">
          {payment.status.verifying}
        </p>
      )}
      {status === 'paid' && (
        <p className="text-green-600">
          {payment.status.confirmed}
        </p>
      )}
      {status === 'used' && (
        <p className="text-yellow-600">
          {payment.status.sessionUsed}
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600">
          {error || payment.status.error}
        </p>
      )}
    </div>
  );
};
