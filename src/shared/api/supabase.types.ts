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

// Contact Messages
export type ContactMessageStatus = 'received' | 'in_progress' | 'responded' | 'closed';
export type ContactMessageReason = 'problem' | 'payment' | 'billing' | 'other';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  reason: ContactMessageReason;
  message: string;
  status: ContactMessageStatus;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessageInsert = {
  name: string;
  email: string;
  reason: ContactMessageReason;
  message: string;
  status?: ContactMessageStatus;
  ip_address?: string | null;
};

export type ContactMessageUpdate = {
  status?: ContactMessageStatus;
  updated_at?: string;
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
      contact_messages: {
        Row: ContactMessage;
        Insert: ContactMessageInsert;
        Update: ContactMessageUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
