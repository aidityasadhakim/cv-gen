# VPS Deployment Guide for CV-Gen

This guide explains how to deploy the CV-Gen application on a VPS (Virtual Private Server) using Docker Compose. The setup includes the Go backend, PostgreSQL database, and the React frontend served via Nginx with HTTPS support using Certbot.

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

### 3. Build and Run (Production Mode)

Use the production compose file to build and start the services. This uses the `prod` targets in the Dockerfiles and sets up the Nginx web server.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This command will:
1.  Start the PostgreSQL database.
2.  Build and start the Go backend (optimized production build).
3.  Build the React frontend and serve it using Nginx (port 80).

### 4. Enable SSL with Certbot

This project uses Certbot to generate free SSL certificates from Let's Encrypt.

**Step 1: Start the services**
Ensure the application is running (as done in step 3). Nginx must be running on port 80 to verify your domain.

**Step 2: Generate the Certificate**
Run the Certbot container to perform the verification:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot
```

This will verify your domain (`cv.aidityas.me`) and save the certificates in `./certbot/conf`.

**Step 3: Update Nginx for HTTPS (Future Step)**
*After* you have successfully generated the certificates, you will need to update `frontend/nginx.conf` to uncomment/add the SSL configuration (listen on 443, path to certificates) and restart the frontend container.

### 5. Verify Deployment
Check if all containers are running:

```bash
docker compose -f docker-compose.prod.yml ps
```

You should see `cvgen-db`, `cvgen-backend`, and `cvgen-frontend` running.

Access your application at `http://cv.aidityas.me`.

## Nginx Configuration Details

The Nginx configuration is located at `frontend/nginx.conf`.

- **Port**: Listens on port 80.
- **Server Name**: Configured for `localhost` and `cv.aidityas.me`.
- **API Proxying**: Requests to `/api` are proxied to the internal `backend` service on port 8080.
- **SPA Routing**: All other requests are served via `index.html`.
- **ACME Challenge**: A location block for `/.well-known/acme-challenge/` allows Certbot to verify domain ownership.

## Project Structure (Production)

- `docker-compose.prod.yml`: The orchestration file for production.
- `frontend/nginx.conf`: The web server configuration.
- `./certbot/`: This directory will appear on your host machine after running Certbot, containing your certificates (`conf`) and verification files (`www`). **Back up this directory.**
