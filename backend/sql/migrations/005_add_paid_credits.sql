-- +goose Up
-- +goose StatementBegin
ALTER TABLE user_credits 
ADD COLUMN paid_credits INTEGER NOT NULL DEFAULT 0,
ADD COLUMN total_generations INTEGER NOT NULL DEFAULT 0;

-- Migrate existing data: total_generations = free_generations_used
UPDATE user_credits SET total_generations = free_generations_used;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE user_credits 
DROP COLUMN paid_credits,
DROP COLUMN total_generations;
-- +goose StatementEnd
