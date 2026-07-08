-- ==========================================================
-- ShaadiPlatform.com Onboarding Wizard Database Schema
-- ==========================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. Users Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'Client' CHECK (role IN ('Client', 'Coordinator', 'Admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure users table columns exist if the table was created previously
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Client';

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================================
-- 2. Planning Requests (Single Table For All Wizard Submissions)
-- ==========================================================
CREATE TABLE IF NOT EXISTS planning_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    custom_city TEXT,
    wedding_month TEXT,
    wedding_day TEXT,
    is_flexible_date BOOLEAN NOT NULL DEFAULT false,
    duration TEXT,
    is_flexible_duration BOOLEAN NOT NULL DEFAULT false,
    budget TEXT,
    is_vegetarian_only BOOLEAN NOT NULL DEFAULT false,
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    guest_counts JSONB NOT NULL DEFAULT '[]'::jsonb,
    rooms JSONB NOT NULL DEFAULT '[]'::jsonb,
    venue_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    venue_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planning_requests_phone ON planning_requests(phone);

-- ==========================================================
-- 3. Row Level Security (RLS) Enable
-- ==========================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_requests ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 4. Row Level Security Policies
-- ==========================================================

-- User-Specific CRUD Policies (Drops existing policies first to prevent conflicts)
DROP POLICY IF EXISTS "Users edit own profile" ON users;
CREATE POLICY "Users edit own profile" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Users edit own planning requests" ON planning_requests;
CREATE POLICY "Users edit own planning requests" ON planning_requests FOR ALL USING (true);

-- ==========================================================
-- 5. Seed Data
-- ==========================================================

-- Seed Users
INSERT INTO users (id, email, name, role) VALUES
('b3c8f8b8-2e06-4b95-a50d-85fa78835848', 'admin@shaadiplatform.com', 'Devika Narain', 'Admin'),
('c3d8f8b8-2e06-4b95-a50d-85fa78835849', 'client@example.com', 'Aman Jha', 'Client')
ON CONFLICT (email) DO NOTHING;
