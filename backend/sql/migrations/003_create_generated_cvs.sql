-- +goose Up
-- +goose StatementBegin
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

CREATE INDEX idx_generated_cvs_user_id ON generated_cvs(user_id);
CREATE INDEX idx_generated_cvs_created_at ON generated_cvs(created_at DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS generated_cvs;
-- +goose StatementEnd
