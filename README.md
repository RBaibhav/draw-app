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
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd draw-app
   ```

2. **Install dependencies:**
   From the root of the workspace, run:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   You will need to set up environment variables for the applications to function properly. Specifically, you need to configure the database connection URL and any JWT secrets.

   Create a `.env` file in the relevant packages (e.g., `packages/db`, `apps/http-backend`, `apps/ws-backend`) based on their specific requirements. Ensure `DATABASE_URL` is set in `packages/db/.env` for Prisma.

4. **Initialize the Database:**
   Navigate into the database package and setup the Prisma client/schema:
   ```bash
   cd packages/db
   npx prisma generate
   npx prisma db push  # or migrate dev
   cd ../..
   ```

## 💻 Running Locally

To run the whole stack concurrently (Frontend, HTTP API, and WebSocket server) using Turborepo from the root directory:

```bash
pnpm run dev
```

This command will start the development servers for all applications simultaneously.

- **Frontend App**: Usually accessible at `http://localhost:3000` (or `3001`).
- **HTTP Backend**: (Check the logs for the specific port).
- **WebSocket Backend**: (Check the logs for the specific port).

## 🧰 Available Scripts

From the root directory, you can run the following global scripts:

- `pnpm dev`: Starts the development servers for all apps.
- `pnpm build`: Builds all apps and packages.
- `pnpm lint`: Lints all code across the monorepo.
- `pnpm format`: Formats code files using Prettier.
- `pnpm check-types`: Runs TypeScript type-checking without emitting files.

---

*This setup guarantees a highly decoupled, scalable, and type-safe environment for building a modern web application.*
