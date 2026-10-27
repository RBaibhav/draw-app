# draw-frontend

Real-time collaborative whiteboard — Next.js frontend for the draw-app monorepo.

## Overview

The frontend connects to two backend services:

| Service | Default URL | Purpose |
|---|---|---|
| `http-backend` | `http://localhost:3002` | REST API — auth, rooms, shapes persistence |
| `ws-backend` | `ws://localhost:8080` | WebSocket server — real-time broadcast |

URLs are configured in [`config.ts`](./config.ts).

---

## Running locally

From the **monorepo root** (recommended — starts all services together):

```bash
pnpm run dev
```

Or from this package only:

```bash
pnpm dev
```

Runs on [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
draw-frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing / home page
│   ├── canvas/[roomId]/    # Whiteboard room page
│   ├── rooms/              # Dedicated rooms hub page
│   ├── signin/             # Sign-in page
│   ├── signup/             # Sign-up page
│   └── loader/             # Loading state page
│
├── components/             # Modular UI components
│   ├── auth/               # Authentication components
│   │   └── AuthPage.tsx    # Styled sign-in / sign-up page matching app theme
│   ├── canvas/             # Whiteboard canvas & controls
│   │   ├── CanvasComponent.tsx # Toolbar + canvas UI; manages tool state
│   │   ├── RoomCanvas.tsx  # Room auth, WebSocket setup, loading/error states
│   │   └── IconButton.tsx  # Toolbar icon button
│   ├── home/               # Landing page sections
│   │   ├── Navbar.tsx      # Top navigation with live auth state
│   │   ├── HeroSection.tsx # Hero with live whiteboard preview graphic
│   │   ├── FeaturesSection.tsx # 4-column feature highlights
│   │   └── Footer.tsx      # App footer
│   ├── rooms/              # Collaborative room management
│   │   ├── RoomHub.tsx     # Room list & creation container
│   │   ├── JoinRoomForm.tsx # Join room form
│   │   ├── CreateRoomForm.tsx # Create room form with name generator
│   │   ├── RoomList.tsx    # User whiteboards list with refresh
│   │   └── RoomCard.tsx    # Individual room card with invite copy & enter
│   └── ui/                 # Reusable utility UI components
│       └── Loader.tsx      # Loading spinner
│
├── draw/                   # Canvas engine (pure TypeScript, no React)
│   ├── index.ts            # initCanvas — event wiring, draw loop
│   ├── shapeData.ts        # Builds shape data objects from pointer coords
│   ├── http.ts             # HTTP helpers (fetch shapes, clear room)
│   └── shapes/
│       ├── Types.ts        # Shape + Points type definitions
│       ├── drawShapes.ts   # Dispatcher — routes a Shape to its renderer
│       ├── circle.ts       # Ellipse renderer
│       ├── line.ts         # Line renderer
│       ├── rect.ts         # Rectangle renderer
│       ├── pencil.ts       # Freehand pencil renderer
│       └── eraser.ts       # Eraser renderer (destination-out composite)
│
└── config.ts               # Backend URLs
```

---

## How the canvas engine works

```
User pointer event
       │
       ▼
  initCanvas (draw/index.ts)
       │
       ├─ onPointerDown  →  record startX/startY, reset stroke buffer
       │
       ├─ onPointerMove  →  clearAndRedraw(persistedShapes)
       │                    + drawShape(livePreview)
       │
       └─ onPointerUp    →  push to persistedShapes
                            clearAndRedraw(persistedShapes)
                            socket.send(draw_shape)
```

**Key design decisions:**

- `shapeTypeRef` is a React ref passed into `initCanvas` so tool switches update instantly without re-initialising the canvas (which would reset `startX`/`startY` to 0 and draw a stray line).
- Every shape renderer owns its own `ctx.beginPath()` to guarantee path isolation.
- `ctx.save()` / `ctx.restore()` in `drawShape` ensures no style leaks between shapes.
- The eraser uses `globalCompositeOperation = "destination-out"` to punch holes in the canvas.

---

## Tools

| Tool | Type | Notes |
|---|---|---|
| Pencil | Freehand | Streams `Points[]` per stroke |
| Rectangle | Bounding box | `startX/Y` → `width/height` |
| Circle / Ellipse | Bounding box | Renders as `ctx.ellipse` |
| Line | Two points | Fixed `thickness: 1` |
| Eraser | Freehand | `destination-out` composite op |
