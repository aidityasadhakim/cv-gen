# CV-Gen

CV-Gen is a full-stack monorepo application designed for generating professional CVs and Resumes. It features a modern Go backend and a React frontend, orchestrated with Docker for a seamless development experience.

## 🚀 Tech Stack

### Backend
*   **Language**: Go 1.25
*   **Framework**: Echo v4
*   **Database**: PostgreSQL
*   **ORM/Query Builder**: SQLC
*   **Migrations**: Goose

### Frontend
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Routing**: TanStack Router
*   **State Management**: TanStack Query
*   **Styling**: Tailwind CSS v4
*   **Runtime**: Bun (inside container)

### Infrastructure
*   **Containerization**: Docker & Docker Compose
*   **Task Runner**: Make

## 🛠️ Getting Started

### Prerequisites
*   [Docker](https://www.docker.com/) and Docker Compose
*   Make (optional, but recommended for running commands)

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd cv-gen
    ```

2.  **Environment Setup**
    Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```
    *Note: Ensure the variables in `.env` match your desired configuration.*

    **Configuration Note:**
    This project is configured with a custom domain `cv.aidityas.me` in the following files:
    - `frontend/nginx.conf` (server_name)
    - `backend/cmd/server/main.go` (CORS settings)
    
    If you are cloning this repository, please update these files to use your own domain or remove them to default to localhost configuration.

3.  **Start the Development Environment**
    Run the following command to build and start all services:
    ```bash
    make dev
    ```
    This will start:
    *   **Backend API**: http://localhost:8080
    *   **Frontend App**: http://localhost:5173
    *   **Database**: PostgreSQL on port 5432

## 📜 Available Commands

The project includes a `Makefile` to simplify common tasks.

### Development
*   `make dev` - Start all services in development mode (with live reload).
*   `make dev-detach` - Start services in the background.
*   `make down` - Stop all running services.
*   `make logs` - View real-time logs from all services.
*   `make restart SERVICE=<name>` - Restart a specific service (e.g., `backend`, `frontend`).

### Database & Migrations
*   `make db-migrate` - Run pending database migrations.
*   `make db-rollback` - Rollback the last migration.
*   `make db-status` - Check the current migration status.
*   `make db-reset` - Reset the database (drop all tables and re-run migrations).
*   `make db-shell` - Connect to the PostgreSQL database via CLI.
*   `make sqlc` - Generate Go code from SQL queries using SQLC.

### Utility & Shell Access
*   `make shell-backend` - Open a shell inside the backend container.
*   `make shell-frontend` - Open a shell inside the frontend container.
*   `make clean` - Remove all containers, volumes, and images.

## 📂 Project Structure

```
cv-gen/
├── backend/           # Go API server
│   ├── cmd/server/    # Application entry point
│   ├── internal/      # Core logic (handlers, models, db)
│   └── sql/           # Migrations and SQLC queries
├── frontend/          # React application
│   └── src/
│       ├── components/# UI components
│       ├── routes/    # File-based routing
│       └── lib/       # Utilities
├── docker-compose.yml # Docker orchestration
└── Makefile           # Command shortcuts
```

## 🤖 AI Agent Guidelines

For detailed instructions on coding conventions, style guides, and agent-specific workflows, please refer to [AGENTS.md](./AGENTS.md).
