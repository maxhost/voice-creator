-- Payment Sessions Table
-- Run this SQL in Supabase SQL Editor to create the required table

CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'used', 'expired')),
  amount INTEGER NOT NULL,

  -- Customer info (from Stripe checkout)
  customer_email TEXT,

  -- Interview results (filled after completion)
  ideas_generated INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_sessions_stripe_id ON payment_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_email ON payment_sessions(customer_email);

-- Enable Row Level Security (RLS)
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access
CREATE POLICY "Service role only" ON payment_sessions
  FOR ALL USING (auth.role() = 'service_role');

GRANT ALL ON payment_sessions TO service_role;
