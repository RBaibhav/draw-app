# Real-time Collaborative Drawing App

A real-time collaborative drawing application built using a modern, scalable monorepo architecture.

This project utilizes **Turborepo** to structure and manage multiple applications and shared packages, ensuring fast builds and a seamless developer experience.

## 🏗️ Architecture overview

The workspace is organized into a monorepo structure utilizing `pnpm` workspaces. It consists of three main applications and several shared libraries:

### Apps

- **`apps/draw-frontend`**: The main user-facing web application built with [Next.js](https://nextjs.org/) and React, styled with Tailwind CSS. Allows users to create and join rooms to draw collaboratively.
- **`apps/http-backend`**: A REST API server built with [Express.js](https://expressjs.com/). Responsible for handling user authentication, room management, and metadata storage.
- **`apps/ws-backend`**: A dedicated [WebSocket](https://github.com/websockets/ws) server that handles the real-time, low-latency synchronization of drawing events between clients in the same room.
- **`apps/web`**: Standard Next.js application template.

### Shared Packages

- **`packages/db`**: The database layer utilizing [Prisma ORM](https://www.prisma.io/) and PostgreSQL. Contains the schema and generated client.
- **`packages/common`**: Shared logic, type definitions, and schema validations using [Zod](https://zod.dev/).
- **`packages/common-backend`**: Shared utilities and configuration specific to backend Node.js environments.
- **`packages/ui`**: A shared generic React component library.
- Config Packages: `@repo/eslint-config` and `@repo/typescript-config` ensure consistent linting and typing rules across the entire monorepo.

## 🚀 Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Real-time Engine**: WebSockets (`ws`)
- **Database**: PostgreSQL, Prisma ORM
- **Tooling**: Turborepo, PNPM, TypeScript, ESLint, Prettier

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PNPM](https://pnpm.io/) (v9.0.0 is used in this project manager)
- [Docker](https://www.docker.com/) (recommended for local PostgreSQL) or an existing PostgreSQL database

---

### 1. 🐳 Start PostgreSQL with Docker

You can launch a local PostgreSQL container using either **Docker Compose** (recommended) or the **Docker CLI**:

#### Option A: Using Docker Compose (Recommended)

Run the included `docker-compose.yml` from the root directory:

```bash
docker compose up -d
```

#### Option B: Using Docker run

Alternatively, run the PostgreSQL container directly:

```bash
docker run -d \
  --name draw-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

> **Useful Docker commands:**
>
> - Check container status: `docker ps`
> - View PostgreSQL logs: `docker logs -f draw-postgres`
> - Stop container: `docker stop draw-postgres`
> - Resume container: `docker start draw-postgres`

---

### 2. 🔑 Configure Environment Variables & Database URL

#### Database Connection String

The default PostgreSQL connection string matching the Docker setup:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

#### Copy Example Environment Files

Copy the provided `example.env` (or `.env.example`) files for Prisma and the backend services:

```bash
# Database package (Prisma schema & client)
cp packages/db/example.env packages/db/.env

# HTTP API Backend (Express)
cp apps/http-backend/example.env apps/http-backend/.env

# WebSocket Backend
cp apps/ws-backend/example.env apps/ws-backend/.env
```

---

### 3. 📦 Install Dependencies

From the root of the workspace:

```bash
pnpm install
```

---

### 4. 🗄️ Initialize Database (Prisma)

Push the database schema to your local PostgreSQL instance and generate the Prisma Client:

```bash
# From root directory:
pnpm run db:push
pnpm run db:generate

# Or directly in packages/db:
cd packages/db
npx prisma db push
npx prisma generate
cd ../..
```

_(Optional)_ To inspect and manage data visually in your browser:

```bash
pnpm run db:studio
```

---

## 💻 Running Locally

To run the whole stack concurrently (Frontend, HTTP API, and WebSocket server) using Turborepo from the root directory:

```bash
pnpm run dev
```

This command will start the development servers for all applications simultaneously:

| Service               | URL / Port                                     | Description                            |
| --------------------- | ---------------------------------------------- | -------------------------------------- |
| **Frontend**          | [http://localhost:3000](http://localhost:3000) | Next.js whiteboard web app             |
| **HTTP Backend**      | [http://localhost:3002](http://localhost:3002) | Express REST API (auth, rooms, shapes) |
| **WebSocket Backend** | `ws://localhost:8080`                          | Real-time drawing synchronization      |
| **PostgreSQL**        | `localhost:5432`                               | Local PostgreSQL Docker container      |

---

## 🧰 Available Scripts

From the root directory, you can run the following global scripts:

- `pnpm dev`: Starts the development servers for all apps.
- `pnpm build`: Builds all apps and packages.
- `pnpm db:push`: Pushes Prisma schema to the database.
- `pnpm db:generate`: Generates Prisma client.
- `pnpm db:studio`: Opens Prisma Studio GUI to view records.
- `pnpm lint`: Lints all code across the monorepo.
- `pnpm format`: Formats code files using Prettier.
- `pnpm check-types`: Runs TypeScript type-checking without emitting files.

---

_This setup guarantees a highly decoupled, scalable, and type-safe environment for building a modern web application._
