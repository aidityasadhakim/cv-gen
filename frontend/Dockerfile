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
# Build Stage
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
# Production Stage (Nginx)
# ================================
FROM nginx:alpine AS prod

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
