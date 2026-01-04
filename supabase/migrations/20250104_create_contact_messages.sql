-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('problem', 'payment', 'billing', 'other')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'in_progress', 'responded', 'closed')),
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for filtering by status
CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- Index for sorting by date
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- RLS policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Only allow insert from authenticated or anon (API routes)
CREATE POLICY "Allow insert contact messages" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read/update (for admin panel later)
CREATE POLICY "Service role full access" ON contact_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();
