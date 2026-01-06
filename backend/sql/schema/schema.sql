-- Schema file for SQLC (combined from migrations)
-- This file is used by SQLC for type generation

CREATE TABLE master_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    resume_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    free_generations_used INTEGER NOT NULL DEFAULT 0,
    free_generations_limit INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE generated_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled CV',
    job_url TEXT,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    job_description TEXT,
    cv_data JSONB NOT NULL DEFAULT '{}',
    match_score INTEGER,
    ai_suggestions JSONB DEFAULT '[]',
    template_id VARCHAR(100) DEFAULT 'professional',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    cv_id UUID REFERENCES generated_cvs(id) ON DELETE CASCADE,
    content TEXT NOT NULL DEFAULT '',
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
