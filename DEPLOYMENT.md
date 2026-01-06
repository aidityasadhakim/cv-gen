# VPS Deployment Guide for CV-Gen

This guide explains how to deploy the CV-Gen application on a VPS (Virtual Private Server) using Docker Compose. The setup includes the Go backend, PostgreSQL database, and the React frontend served via Nginx.

## Prerequisites

Ensure your VPS has the following installed:
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Deployment Steps

### 1. Clone the Repository
SSH into your VPS and clone the repository:

```bash
git clone https://github.com/yourusername/cv-gen.git
cd cv-gen
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory. You can start by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your production values:

```bash
# Database Configuration
POSTGRES_USER=your_secure_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=cvgen_db

# Backend Configuration
# Use the service name 'db' for the host within Docker network
DATABASE_URL=postgres://your_secure_user:your_secure_password@db:5432/cvgen_db?sslmode=disable
BACKEND_PORT=8080
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key

# Frontend Configuration
# Point to the /api path which Nginx proxies to the backend
VITE_API_URL=/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Build and Run
Build and start the services in detached mode:

```bash
docker compose up -d --build
```

This command will:
1.  Start the PostgreSQL database.
2.  Build and start the Go backend.
3.  Build the React frontend and serve it using the Nginx configuration.

### 4. Verify Deployment
Check if all containers are running:

```bash
docker compose ps
```

You should see `cvgen-db`, `cvgen-backend`, and `cvgen-frontend` running.

Access your application at `http://cv.aidityas.me` (ensure your DNS is configured to point to your VPS IP).

## Nginx Configuration Details

The Nginx configuration is located at `frontend/nginx.conf`. It is automatically applied when the frontend container starts.

- **Port**: Listens on port 80.
- **Server Name**: Configured for `localhost` and `cv.aidityas.me`.
- **API Proxying**: Requests to `/api` are proxied to the internal `backend` service on port 8080.
- **SPA Routing**: All other requests are served via `index.html` to support client-side routing.

## Enabling HTTPS (Recommended)

The current setup serves traffic over HTTP. To secure your site with HTTPS, you have a few options:

### Option A: Reverse Proxy (Traefik / Caddy / System Nginx)
Run a reverse proxy on your host machine (outside Docker) or as another container that handles SSL termination (e.g., using Let's Encrypt) and forwards traffic to the exposed port 80 of the `cvgen-frontend` container.

### Option B: Cloudflare
If you manage your DNS with Cloudflare, you can enable "Flexible" or "Full" SSL mode, which handles HTTPS between the user and Cloudflare, while Cloudflare talks to your VPS over HTTP.
