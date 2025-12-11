/**
 * Supabase database types.
 * These should match the actual database schema.
 */

export type PaymentSessionStatus = 'pending' | 'paid' | 'used' | 'expired';

export type PaymentSession = {
  id: string;
  stripe_session_id: string;
  status: PaymentSessionStatus;
  amount: number;
  customer_email: string | null;
  ideas_generated: number;
  created_at: string;
  paid_at: string | null;
  used_at: string | null;
};

export type PaymentSessionInsert = {
  stripe_session_id: string;
  status: PaymentSessionStatus;
  amount: number;
  customer_email?: string | null;
  ideas_generated?: number;
  paid_at?: string | null;
  used_at?: string | null;
};

export type PaymentSessionUpdate = {
  status?: PaymentSessionStatus;
  customer_email?: string | null;
  ideas_generated?: number;
  paid_at?: string | null;
  used_at?: string | null;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  public: {
    Tables: {
      payment_sessions: {
        Row: PaymentSession;
        Insert: PaymentSessionInsert;
        Update: PaymentSessionUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
