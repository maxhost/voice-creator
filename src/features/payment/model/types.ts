export type PaymentStatus =
  | 'idle'
  | 'redirecting'
  | 'verifying'
  | 'paid'
  | 'used'
  | 'error';

export type PaymentState = {
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  status: PaymentStatus;
};

export type PaymentError = {
  code: PaymentErrorCode;
  message: string;
};

export type PaymentErrorCode =
  | 'CHECKOUT_CREATION_FAILED'
  | 'PAYMENT_DECLINED'
  | 'SESSION_USED'
  | 'VERIFICATION_FAILED'
  | 'UNKNOWN';
