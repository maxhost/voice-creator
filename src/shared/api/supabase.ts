import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

/**
 * Supabase client for server-side operations only.
 * Uses service key - never expose to client.
 * Lazy initialization to avoid build-time errors.
 */
let supabaseClient: SupabaseClient<Database> | null = null;

export const getSupabase = (): SupabaseClient<Database> => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
};

// Proxy object for lazy initialization
export const supabase = {
  from: <T extends keyof Database['public']['Tables']>(table: T) => {
    return getSupabase().from(table);
  },
};
