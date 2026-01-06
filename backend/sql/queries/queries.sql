-- Placeholder for SQLC queries
-- Add your queries here when the schema is defined.

-- Example queries (uncomment when users table exists):

-- name: GetUser :one
-- SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: ListUsers :many
-- SELECT * FROM users ORDER BY created_at DESC;

-- name: CreateUser :one
-- INSERT INTO users (email, name)
-- VALUES ($1, $2)
-- RETURNING *;

-- name: UpdateUser :one
-- UPDATE users
-- SET name = $2, updated_at = NOW()
-- WHERE id = $1
-- RETURNING *;

-- name: DeleteUser :exec
-- DELETE FROM users WHERE id = $1;
