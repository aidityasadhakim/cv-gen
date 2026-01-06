# ================================
# Development Stage (with Air hot-reload)
# ================================
FROM golang:1.25-alpine AS dev

WORKDIR /app

# Install Air for hot-reload
RUN go install github.com/air-verse/air@latest

# Install Goose for migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Install SQLC for code generation
RUN go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

# Copy go mod files first for better caching
COPY go.mod go.sum* ./
RUN go mod download

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Run Air for hot-reload
CMD ["air", "-c", ".air.toml"]

# ================================
# Build Stage
# ================================
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum* ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/server

# ================================
# Production Stage
# ================================
FROM alpine:3.21 AS prod

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binary from builder
COPY --from=builder /app/server .

# Copy migrations (needed for production migrations)
COPY --from=builder /app/sql/migrations ./sql/migrations

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./server"]
