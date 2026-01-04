'use client';

import { useLanguage, getTranslation } from '@/shared/i18n';
import { interview } from '@/shared/i18n';
import { PaymentButton, PaymentStatus } from '@/features/payment';
import { usePaymentModal } from '../model/usePaymentModal';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const { status, error, isLoading, handlePayment } = usePaymentModal();
  const lang = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{getTranslation(interview.payment.title, lang)}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary-600">
              <span className="line-through text-gray-400 text-2xl">$5</span>{' '}
              $3.99
            </p>
            <p className="text-gray-500">{getTranslation(interview.payment.earlyAccess, lang)}</p>
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {getTranslation(interview.payment.features.interview, lang)}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {getTranslation(interview.payment.features.ideas, lang)}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {getTranslation(interview.payment.features.pdf, lang)}
            </li>
          </ul>

          <PaymentStatus status={status} error={error} />

          <PaymentButton
            onClick={handlePayment}
            loading={isLoading}
            disabled={isLoading}
          />

          <p className="text-xs text-center text-gray-400">
            {getTranslation(interview.payment.securePayment, lang)}
          </p>
        </div>
      </div>
    </div>
  );
};
