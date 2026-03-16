-- Module 2.1: Application Management System
-- Database Schema for PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- MAIN APPLICATIONS TABLE
-- ==========================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    primary_applicant_id UUID NOT NULL REFERENCES users(id),
    
    -- Status & Scoring
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'under_review', 'verification_pending',
        'conditionally_approved', 'approved', 'approved_with_conditions',
        'rejected', 'withdrawn'
    )),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    score_breakdown JSONB,
    
    -- Preferences
    move_in_date DATE,
    lease_term INTEGER, -- months
    applicant_notes TEXT,
    
    -- Landlord Review
    landlord_notes TEXT,
    rejection_reason TEXT,
    conditions TEXT[],
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Timestamps
    submitted_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_applicant_id ON applications(primary_applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_score ON applications(score);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);

-- ==========================================
-- PERSONAL INFORMATION
-- ==========================================
CREATE TABLE application_personal_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    -- Name
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    
    -- Contact
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Personal Details
    date_of_birth DATE NOT NULL,
    ssn_encrypted TEXT NOT NULL, -- Encrypted
    
    -- Current Address
    current_address JSONB NOT NULL,
    previous_addresses JSONB[],
    
    -- Identification
    id_type VARCHAR(50) NOT NULL CHECK (id_type IN ('drivers_license', 'passport', 'state_id')),
    id_number_encrypted TEXT NOT NULL, -- Encrypted
    id_expiration DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_personal_info_application_id ON application_personal_info(application_id);

-- ==========================================
-- EMPLOYMENT HISTORY
-- ==========================================
CREATE TABLE application_employment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    employer_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN (
        'full_time', 'part_time', 'contract', 'self_employed'
    )),
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Supervisor Contact
    supervisor_name VARCHAR(255),
    supervisor_phone VARCHAR(20),
    supervisor_email VARCHAR(255),
    
    -- Address
    address JSONB NOT NULL,
    
    -- Verification
    verification_status VARCHAR(50) DEFAULT 'not_started' CHECK (verification_status IN (
        'not_started', 'pending', 'in_progress', 'verified', 'failed', 'manual_review'
    )),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employment_application_id ON application_employment(application_id);

-- ==========================================
-- INCOME INFORMATION
-- ==========================================
CREATE TABLE application_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    source VARCHAR(50) NOT NULL CHECK (source IN (
        'employment', 'self_employment', 'investment', 'social_security',
        'disability', 'retirement', 'alimony', 'other'
    )),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN (
        'hourly', 'weekly', 'biweekly', 'monthly', 'annually'
    )),
    
    -- Verification
    verification_status VARCHAR(50) DEFAULT 'not_started' CHECK (verification_status IN (
        'not_started', 'pending', 'in_progress', 'verified', 'failed', 'manual_review'
    )),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_income_application_id ON application_income(application_id);

-- ==========================================
-- RENTAL HISTORY
-- ==========================================
CREATE TABLE application_rental_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    address JSONB NOT NULL,
    
    -- Landlord Contact
    landlord_name VARCHAR(255) NOT NULL,
    landlord_phone VARCHAR(20) NOT NULL,
    landlord_email VARCHAR(255),
    
    -- Rental Details
    monthly_rent DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason_for_leaving TEXT NOT NULL,
    
    -- Verification
    can_contact BOOLEAN DEFAULT TRUE,
    verification_status VARCHAR(50) DEFAULT 'not_started' CHECK (verification_status IN (
        'not_started', 'pending', 'in_progress', 'verified', 'failed', 'manual_review'
    )),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rental_history_application_id ON application_rental_history(application_id);

-- ==========================================
-- REFERENCES
-- ==========================================
CREATE TABLE application_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES