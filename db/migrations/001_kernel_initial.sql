-- Kernel Initial Schema
-- Core tables: organizations, users, user_org_memberships, horses, stalls

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (tenants)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  max_horses INT NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orgs_slug ON organizations(slug);

-- Users
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY, -- Supabase UUID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- User-Organization Memberships (with RBAC)
CREATE TABLE user_org_memberships (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  org_id INT NOT NULL REFERENCES organizations(id),
  role TEXT NOT NULL, -- owner, manager, trainer, groom, accountant
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

CREATE INDEX idx_memberships_user_id ON user_org_memberships(user_id);
CREATE INDEX idx_memberships_org_id ON user_org_memberships(org_id);

-- Horses
CREATE TABLE horses (
  id SERIAL PRIMARY KEY,
  org_id INT NOT NULL REFERENCES organizations(id),

  -- Identification
  registered_name TEXT NOT NULL,
  barn_name TEXT NOT NULL,
  breed TEXT,
  color TEXT,
  markings TEXT,
  sex TEXT NOT NULL CHECK (sex IN ('mare', 'stallion', 'gelding')),
  dob DATE,
  height_hands INT,
  weight_lbs INT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'boarding', 'in-training', 'archived')),
  discipline TEXT,
  special_needs TEXT,

  -- Ownership
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  owner_emergency_contact TEXT,
  owner_emergency_phone TEXT,

  -- Insurance
  insurance_carrier TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_horses_org_id ON horses(org_id);
CREATE INDEX idx_horses_status ON horses(status);

-- Enable RLS on horses
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
CREATE POLICY horses_org_isolation ON horses
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()::text
  ));

-- Stalls
CREATE TABLE stalls (
  id SERIAL PRIMARY KEY,
  org_id INT NOT NULL REFERENCES organizations(id),

  stall_number TEXT NOT NULL,
  building_location TEXT,
  barn_section TEXT,

  stall_type TEXT NOT NULL,
  size TEXT,
  bedding_type TEXT,

  status TEXT NOT NULL DEFAULT 'available',
  position JSONB, -- { x: 0, y: 0 }

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, stall_number)
);

CREATE INDEX idx_stalls_org_id ON stalls(org_id);
CREATE INDEX idx_stalls_status ON stalls(status);

-- Enable RLS on stalls
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
CREATE POLICY stalls_org_isolation ON stalls
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships WHERE user_id = auth.uid()::text
  ));
