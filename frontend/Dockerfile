# ================================
# Development Stage (with Vite HMR)
# ================================
FROM oven/bun:1 AS dev

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Run Vite dev server with host flag for Docker
CMD ["bun", "run", "dev", "--host"]

# ================================
# Build Stage (for Caddy static serving)
# ================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies (including devDependencies for build)
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# ================================
# Dist Stage (for Caddy)
# ================================
# This stage produces static files that Caddy will serve directly
# No server needed - Caddy handles static file serving
FROM scratch AS dist

# Copy built assets from builder
COPY --from=builder /app/dist /

# Metadata for the image
LABEL maintainer="cv-gen"
LABEL description="CV-Gen frontend static files"
