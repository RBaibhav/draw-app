# http-backend

REST API server for the draw-app monorepo. Handles authentication, room management, and shape persistence.

## Overview

| Detail | Value |
|---|---|
| Framework | Express |
| Default port | `3002` |
| Auth | JWT via `Authorization: Bearer <token>` |
| DB | Prisma (`@repo/db`) |

---

## Running locally

From the **monorepo root** (recommended):

```bash
pnpm run dev
```

Or from this package only:

```bash
pnpm dev
```

---

## Source structure

```
http-backend/src/
├── index.ts          # Entry point — app setup and route mounting
├── middleware.ts     # auth middleware — JWT verification, attaches req.userId
└── routes/
    ├── auth.ts       # POST /signup  POST /signin
    ├── rooms.ts      # POST /room  POST /room/join  GET /rooms  GET /room/:slug  GET /room/id/:roomId
    └── shapes.ts     # GET /shapes/:roomId  DELETE /shapes/:roomId
```

---

## API reference

### Auth

#### `POST /signup`
Create a new user account.

**Body**
```json
{ "username": "user@example.com", "password": "...", "name": "Alice" }
```

**Responses**
- `201` — `{ user }` 
- `400` — Validation error
- `411` — User already exists

---

#### `POST /signin`
Sign in and receive a JWT.

**Body**
```json
{ "username": "user@example.com", "password": "..." }
```

**Responses**
- `200` — `{ token, userId, name, email }`
- `400` — Validation error
- `401` — Invalid credentials

---

### Rooms

All room routes require `Authorization: Bearer <token>`.

#### `POST /room`
Create a new room. Creator is automatically added as admin.

**Body**
```json
{ "name": "my-room-slug" }
```

**Responses**
- `201` — `{ room: id, slug, admin: adminId }`
- `500` — Room already exists

---

#### `POST /room/join`
Join a room by slug or numeric ID. Idempotent — safe to call multiple times.

**Body** (one of)
```json
{ "slug": "my-room-slug" }
{ "roomId": 42 }
```

**Responses**
- `200` — `{ message, room: { id, slug, adminId, admin } }`
- `404` — Room not found

---

#### `GET /rooms`
List all rooms the authenticated user has created or joined.

**Response**
```json
{
  "rooms": [{ "id", "slug", "adminId", "admin", "_count": { "members", "shapes" } }]
}
```

---

#### `GET /room/:slug`
Get room details by slug, including member list.

#### `GET /room/id/:roomId`
Get room details by numeric ID, including member list.

---

#### `DELETE /room/:identifier` 🔒
Delete a room and all its associated shapes and memberships. Only permitted for the room admin. Identifier can be the room slug or numeric ID.

**Responses**
- `200` — `{ message: "Room deleted successfully", roomId, slug }`
- `403` — Unauthorized (user is not room admin)
- `404` — Room not found

---

#### `POST /room/leave` 🔒
Leave a room and remove the current user's membership.

**Body**
```json
{ "roomId": 123 } // or { "slug": "room-slug" }
```

**Responses**
- `200` — `{ message: "Left room successfully", roomId, slug }`
- `404` — Room not found

---

### Shapes

#### `GET /shapes/:roomId`
Fetch all shapes for a room in creation order. Public — no auth required.

**Response**
```json
{ "shapes": [{ "id", "type", ...shapeData }] }
```

---

#### `DELETE /shapes/:roomId` 🔒
Clear all shapes for a room. Requires auth.

**Response**
```json
{ "message": "Canvas cleared successfully" }
```

---

## Middleware

[`middleware.ts`](./src/middleware.ts) exports the `auth` Express middleware:

- Reads `Authorization` header — supports both `Bearer <token>` and a raw token
- Verifies the JWT against `JWT_SECRET`
- Attaches `req.userId` for downstream route handlers
- Returns `401` on missing or invalid tokens

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3002` | HTTP server port |
| `DATABASE_URL` | — | Postgres connection string (via `@repo/db`) |
| `JWT_SECRET` | — | JWT signing secret (via `@repo/common-backend`) |

Set these in `.env` at the package root.
