-- +goose Up
-- +goose StatementBegin
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

CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_cv_id ON cover_letters(cv_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS cover_letters;
-- +goose StatementEnd
