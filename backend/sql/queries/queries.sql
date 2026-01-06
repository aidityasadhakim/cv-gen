-- ===================
-- Master Profiles
-- ===================

-- name: GetMasterProfile :one
SELECT * FROM master_profiles WHERE user_id = $1 LIMIT 1;

-- name: CreateMasterProfile :one
INSERT INTO master_profiles (user_id, resume_data)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateMasterProfile :one
UPDATE master_profiles
SET resume_data = $2, updated_at = NOW()
WHERE user_id = $1
RETURNING *;

-- name: UpsertMasterProfile :one
INSERT INTO master_profiles (user_id, resume_data)
VALUES ($1, $2)
ON CONFLICT (user_id) DO UPDATE
SET resume_data = EXCLUDED.resume_data, updated_at = NOW()
RETURNING *;

-- name: DeleteMasterProfile :exec
DELETE FROM master_profiles WHERE user_id = $1;

-- ===================
-- User Credits
-- ===================

-- name: GetUserCredits :one
SELECT * FROM user_credits WHERE user_id = $1 LIMIT 1;

-- name: CreateUserCredits :one
INSERT INTO user_credits (user_id, free_generations_used, free_generations_limit, paid_credits, total_generations)
VALUES ($1, 0, 10, 0, 0)
RETURNING *;

-- name: IncrementCreditsUsed :one
-- Increments total_generations, uses free credits first, then paid credits
UPDATE user_credits
SET 
    total_generations = total_generations + 1,
    free_generations_used = CASE 
        WHEN free_generations_used < free_generations_limit THEN free_generations_used + 1
        ELSE free_generations_used
    END,
    paid_credits = CASE 
        WHEN free_generations_used >= free_generations_limit THEN paid_credits - 1
        ELSE paid_credits
    END,
    updated_at = NOW()
WHERE user_id = $1
RETURNING *;

-- name: GetOrCreateUserCredits :one
INSERT INTO user_credits (user_id, free_generations_used, free_generations_limit, paid_credits, total_generations)
VALUES ($1, 0, 10, 0, 0)
ON CONFLICT (user_id) DO UPDATE
SET updated_at = NOW()
RETURNING *;

-- name: AddPaidCredits :one
-- Add purchased credits to user's balance
UPDATE user_credits
SET paid_credits = paid_credits + $2, updated_at = NOW()
WHERE user_id = $1
RETURNING *;

-- ===================
-- Generated CVs
-- ===================

-- name: GetCV :one
SELECT * FROM generated_cvs WHERE id = $1 LIMIT 1;

-- name: GetCVByUserAndId :one
SELECT * FROM generated_cvs WHERE id = $1 AND user_id = $2 LIMIT 1;

-- name: ListCVsByUser :many
SELECT * FROM generated_cvs 
WHERE user_id = $1 
ORDER BY created_at DESC;

-- name: ListCVsByUserPaginated :many
SELECT * FROM generated_cvs 
WHERE user_id = $1 
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: CountCVsByUser :one
SELECT COUNT(*) FROM generated_cvs WHERE user_id = $1;

-- name: CreateCV :one
INSERT INTO generated_cvs (
    user_id, name, job_url, job_title, company_name, 
    job_description, cv_data, match_score, ai_suggestions, template_id
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: UpdateCV :one
UPDATE generated_cvs
SET 
    name = COALESCE($3, name),
    cv_data = COALESCE($4, cv_data),
    template_id = COALESCE($5, template_id),
    updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;

-- name: UpdateCVName :one
UPDATE generated_cvs
SET name = $3, updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteCV :exec
DELETE FROM generated_cvs WHERE id = $1 AND user_id = $2;

-- ===================
-- Cover Letters
-- ===================

-- name: GetCoverLetter :one
SELECT * FROM cover_letters WHERE id = $1 LIMIT 1;

-- name: GetCoverLetterByUserAndId :one
SELECT * FROM cover_letters WHERE id = $1 AND user_id = $2 LIMIT 1;

-- name: ListCoverLettersByUser :many
SELECT * FROM cover_letters 
WHERE user_id = $1 
ORDER BY created_at DESC;

-- name: ListCoverLettersByCV :many
SELECT * FROM cover_letters 
WHERE cv_id = $1 
ORDER BY created_at DESC;

-- name: CreateCoverLetter :one
INSERT INTO cover_letters (user_id, cv_id, content, job_title, company_name)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateCoverLetter :one
UPDATE cover_letters
SET content = $3, updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;

-- name: DeleteCoverLetter :exec
DELETE FROM cover_letters WHERE id = $1 AND user_id = $2;
