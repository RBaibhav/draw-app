# ws-backend

Real-time WebSocket server for the draw-app monorepo. Handles room presence, shape broadcasting, and shape persistence.

## Overview

| Detail | Value |
|---|---|
| Protocol | WebSocket (`ws`) |
| Default port | `8080` |
| Auth | JWT via query string (`?token=...`) |
| DB | Prisma (`@repo/db`) — shapes only |

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
ws-backend/src/
├── index.ts              # Entry point — server setup, auth gate, connection lifecycle
├── auth.ts               # JWT verification + token extraction from request URL
├── registry.ts           # In-memory user registry + broadcastToRoom helper
└── handlers/
    ├── dispatch.ts       # Routes incoming messages to the correct handler
    ├── joinRoom.ts       # join_room — DB upsert, ACK, presence broadcast
    ├── leaveRoom.ts      # leave_room — presence broadcast
    ├── drawShape.ts      # draw_shape — DB persist, broadcast to room
    └── clearCanvas.ts    # clear_canvas — DB delete, broadcast to room
```

---

## Connection flow

```
Client connects: ws://localhost:8080?token=<JWT>
        │
        ├─ Token missing or invalid → close(1008, "Unauthorized")
        │
        └─ Valid → register ConnectedUser { ws, userId, rooms: Set<number> }
                   send "something"  ← handshake ACK
                        │
                        ├─ message → dispatch(user, rawData)
                        │
                        └─ close   → unregisterUser(user)
```

---

## Message protocol

All messages are JSON. The client must include a `roomId` field for room-scoped events.

### Client → Server

| `type` | Required fields | Description |
|---|---|---|
| `join_room` | `roomId` | Join a room; records membership in DB |
| `leave_room` | `roomId` | Leave a room |
| `draw_shape` | `roomId`, `shape` | Persist and broadcast a shape |
| `clear_canvas` | `roomId` | Delete all shapes for the room and broadcast |

### Server → Client

| `type` | Fields | When |
|---|---|---|
| `joined_room` | `roomId`, `memberCount` | Sent to the joining user only |
| `user_joined` | `userId`, `roomId`, `memberCount` | Broadcast to other room members |
| `user_left` | `userId`, `roomId` | Broadcast to other room members |
| `draw_shape` | `roomId`, `userId`, `shape`, `shapeId` | Broadcast to all room members |
| `clear_canvas` | `roomId`, `userId` | Broadcast to all room members |

---

## Authentication

The client appends its JWT as a query parameter on connect:

```
ws://localhost:8080?token=eyJhbGciOiJIUzI1NiJ9...
```

`auth.ts` verifies the token against `JWT_SECRET` (from `@repo/common-backend/config`). Connections with a missing or invalid token are immediately closed with code `1008`.

---

## In-memory registry

`registry.ts` maintains a flat `ConnectedUser[]` array. There is no Redis or external pub/sub — this is a single-process server. `broadcastToRoom` iterates the array and sends to all open sockets in the target room, optionally excluding the sender.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | WebSocket server port |
| `DATABASE_URL` | — | Postgres connection string (via `@repo/db`) |
| `JWT_SECRET` | — | Signing secret (via `@repo/common-backend`) |

Set these in `.env` at the package root.
