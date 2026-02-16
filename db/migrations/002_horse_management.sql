-- Horse Management Module Schema
-- Health records and documents

-- Health Records
CREATE TABLE health_records (
  id SERIAL PRIMARY KEY,
  horse_id INT NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  org_id INT NOT NULL REFERENCES organizations(id),

  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'deworming', 'vet-visit', 'medication', 'injury')),
  record_date DATE NOT NULL,
  description TEXT,
  notes TEXT,
  vet_name TEXT,
  next_due_date DATE,

  -- For medications
  medication_name TEXT,
  dosage TEXT,
  administration_time TEXT,
  prescribing_vet TEXT,

  -- For vaccinations
  vaccine_type TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_health_records_horse_id ON health_records(horse_id);
CREATE INDEX idx_health_records_org_id ON health_records(org_id);
CREATE INDEX idx_health_records_due_date ON health_records(next_due_date);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY health_records_org_isolation ON health_records
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()::text
  ));

-- Horse Documents
CREATE TABLE horse_documents (
  id SERIAL PRIMARY KEY,
  horse_id INT NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  org_id INT NOT NULL REFERENCES organizations(id),

  document_type TEXT NOT NULL CHECK (document_type IN ('registration', 'insurance', 'coggins', 'health-cert', 'other')),
  document_name TEXT NOT NULL,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  expires_at DATE,

  created_by VARCHAR(255) NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_documents_horse_id ON horse_documents(horse_id);
CREATE INDEX idx_documents_org_id ON horse_documents(org_id);
CREATE INDEX idx_documents_expires_at ON horse_documents(expires_at);

-- Enable RLS
ALTER TABLE horse_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_org_isolation ON horse_documents
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()::text
  ));
