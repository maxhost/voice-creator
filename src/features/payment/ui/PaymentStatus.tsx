'use client';

import type { PaymentStatus as PaymentStatusType } from '../model/types';

type PaymentStatusProps = {
  status: PaymentStatusType;
  error?: string | null;
};

export const PaymentStatus = ({ status, error }: PaymentStatusProps) => {
  if (status === 'idle') return null;

  return (
    <div className="text-center">
      {status === 'redirecting' && (
        <p className="text-gray-500">Redirigiendo a pago...</p>
      )}
      {status === 'verifying' && (
        <p className="text-gray-500">Verificando pago...</p>
      )}
      {status === 'paid' && (
        <p className="text-green-600">Pago confirmado</p>
      )}
      {status === 'used' && (
        <p className="text-yellow-600">Sesión ya utilizada</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">{error || 'Error en el pago'}</p>
      )}
    </div>
  );
};
