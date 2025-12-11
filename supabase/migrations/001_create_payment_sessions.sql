-- Payment Sessions Table
-- Run this SQL in Supabase SQL Editor to create the required table

-- Create the payment_sessions table
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'used', 'expired')),
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ
);

-- Create index for faster lookups by stripe_session_id
CREATE INDEX IF NOT EXISTS idx_payment_sessions_stripe_id
  ON payment_sessions(stripe_session_id);

-- Create index for status queries (useful for analytics/cleanup)
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status
  ON payment_sessions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (backend-only table)
-- No public access - all operations through API routes with service key
CREATE POLICY "Service role only" ON payment_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions to service role
GRANT ALL ON payment_sessions TO service_role;

-- Function to clean up expired pending sessions (optional cron job)
-- Marks pending sessions older than 24 hours as expired
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE payment_sessions
  SET status = 'expired'
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
