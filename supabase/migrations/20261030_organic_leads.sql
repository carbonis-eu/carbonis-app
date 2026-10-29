CREATE TABLE IF NOT EXISTS organic_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  contact_name text NOT NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  industry text NOT NULL,
  estimated_contacts text,
  recommended_package text,
  estimated_roi_eur numeric,
  status text DEFAULT 'new',
  gdpr_consent bool DEFAULT false,
  gdpr_consent_at timestamptz,
  source text DEFAULT 'vera_chatbot',
  conversation_log jsonb
);
ALTER TABLE organic_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON organic_leads FOR ALL USING (auth.jwt()->>'role' = 'admin');
