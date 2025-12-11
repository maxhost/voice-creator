'use client';

import { usePayment } from '@/features/payment';

export const usePaymentModal = () => {
  const { status, error, isLoading, initiateCheckout } = usePayment();

  return {
    status,
    error,
    isLoading,
    handlePayment: initiateCheckout,
  };
};
