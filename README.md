# Codelyne Website V2 (Docker Local Development)

This repository contains the **Codelyne Website V2** application exported from Replit.

The primary runnable app in this repository is the root project (`package.json` in repository root), which is a:

- Node.js 20 backend (`Express` + `TypeScript`)
- Vite + React frontend served by the same backend
- PostgreSQL database layer using `drizzle-orm` and `drizzle-kit`
- Session-based auth using `express-session` + `passport`

This guide sets up a complete local Docker-based development environment without changing business logic.

---

## 1) Prerequisites

Install the following on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)
- [Git](https://git-scm.com/)

Optional but useful:

- `psql` client for checking the database manually

---

## 2) Files Added for Containerization

The following infrastructure files are included:

- `docker/Dockerfile` (dev + production stages)
- `docker/docker-compose.yml` (application + PostgreSQL)
- `.dockerignore`
- `.env.example`
- `docker/postgres/init.sql` (creates `pgcrypto` extension required by schema default UUID generation)

---

## 3) Environment Variables

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Update `.env` with real values (see secret migration notes below).

### Required Variables

- `DATABASE_URL`  
  PostgreSQL connection string used by app + Drizzle.
- `SESSION_SECRET`  
  Strong random secret for session signing.
- `SITE_URL`  
  Backend URL used for SEO/sitemap origin.
- `VITE_SITE_URL`  
  Frontend SEO canonical base URL.
- `SETUP_KEY`  
  Protects `/api/setup/init`.

### Object Storage Variables (feature-critical for uploads/media)

- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

These are required by the Replit object storage integration in `server/replit_integrations/object_storage/*`.

If these are not set, upload and object routes will fail.

---

## 4) Secret / Key Migration from Replit

From your Replit project Secrets/Environment panel, migrate these values into local `.env`:

- `DATABASE_URL` (if you want to use your existing hosted DB)
- `SESSION_SECRET`
- `SITE_URL` (set to local for dev, production URL for prod)
- `VITE_SITE_URL` (same recommendation as above)
- `SETUP_KEY`
- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

### Important Note on Replit Object Storage

The code uses Replit-specific sidecar endpoints (`http://127.0.0.1:1106`) for signed URLs and credentials.  
In plain local Docker, that sidecar does not exist by default.

For full upload/media parity, you need one of the following:

- Keep using Replit-managed object storage with equivalent auth plumbing available to your local runtime, or
- Refactor storage integration to a local/cloud provider (e.g., S3/GCS/MinIO) in a future change.

All non-object-storage features (API, frontend, auth, database CRUD) are fully runnable with this Docker setup.

---

## 5) Start Locally with Docker Compose

From repository root:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

What happens:

- PostgreSQL starts on `localhost:5432`
- App starts on `localhost:5000`
- On app start, it runs:
  - `npm install`
  - `npm run db:push` (sync schema)
  - `npm run dev` (Express + Vite dev workflow)

Open the app at:

- [http://localhost:5000](http://localhost:5000)

---

## 6) Useful Docker Commands

### View logs

```bash
docker compose logs -f app
docker compose logs -f db
```

### Restart services

```bash
docker compose restart app
docker compose restart db
```

### Stop everything

```bash
docker compose down
```

### Stop + remove volumes (reset DB)

```bash
docker compose down -v
```

---

## 7) Development Notes

- Source code is bind-mounted into `/app` for fast local iteration.
- `app_node_modules` is a named volume so Linux container modules are not overwritten by host mounts.
- App listens on `0.0.0.0:5000`, matching the original Replit runtime behavior.

---

## 8) Production Image Build (Optional)

The `docker/Dockerfile` includes a production stage that builds static assets and runs `dist/index.cjs`.

Build and run:

```bash
docker build --target production -t codelyne-website-v2:prod .
docker run --rm -p 5000:5000 --env-file .env codelyne-website-v2:prod
```

---

## 9) Troubleshooting

### A) App container exits with DB connection error

- Confirm DB is healthy:
  ```bash
  docker compose ps
  docker compose logs -f db
  ```
- Verify `DATABASE_URL` host is `db` (inside compose network), not `localhost`.

### B) Schema push fails

- Make sure DB credentials in `.env` match compose DB config.
- Reset DB and retry:
  ```bash
  docker compose down -v
  docker compose -f docker/docker-compose.yml up --build -d
  ```

### C) Login/session issues behind proxies

- In local dev this should work as-is.
- For production/reverse proxy deployments, ensure correct HTTPS + forwarded headers.

### D) Upload/Object routes fail

- Verify `PUBLIC_OBJECT_SEARCH_PATHS` and `PRIVATE_OBJECT_DIR` are set.
- Remember: Replit object sidecar is not available in plain local Docker unless separately reproduced.

### E) Port already in use (`5000` or `5432`)

- Stop conflicting local processes/containers, or change compose port mappings.

---

## 10) Tech Stack Detection Summary (from codebase analysis)

- Runtime: Node.js 20
- Backend entrypoint (dev): `backend/server/index.ts` via `npm run dev`
- Production entrypoint: `dist/index.cjs` via `npm run start`
- Frontend: Vite + React in `client/`
- Database: PostgreSQL + Drizzle (`backend/server/db.ts`, `database/drizzle.config.ts`, `backend/shared/schema.ts`)
- Default service port: `5000` (from `.replit` and server runtime)

