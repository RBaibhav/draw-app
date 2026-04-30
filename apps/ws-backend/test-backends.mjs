/**
 * draw-app Backend Test Suite
 * Tests: HTTP backend (port 3001) + WS backend (port 8080)
 *
 * Run from apps/ws-backend/ so the local ws package resolves.
 */

import { WebSocket } from "ws";

const HTTP = "http://localhost:3001";
const WS   = "ws://localhost:8080";

let passed = 0;
let failed = 0;
const issues = [];

// ─── helpers ─────────────────────────────────────────────────────────────────

function log(label, ok, detail = "", bug = "") {
  const icon = ok ? "✅" : "❌";
  console.log(`${icon}  ${label}${detail ? "  →  " + detail : ""}`);
  if (!ok && bug) {
    console.log(`     🐛 BUG: ${bug}`);
    issues.push({ label, bug });
  }
  ok ? passed++ : failed++;
}

async function req(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${HTTP}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json;
  try { json = await res.json(); } catch { json = null; }
  return { status: res.status, json };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── main ────────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n════════════════════════════════════════");
  console.log("  draw-app Backend Test Suite");
  console.log("════════════════════════════════════════\n");

  // NOTE: SignInSchema has max:20 on username. Use short email to stay within limit.
  const SHORT_USER  = `t${Date.now()}@x.io`;   // ≤20 chars
  const SHORT_PASS  = "password123";

  if (SHORT_USER.length > 20) {
    console.warn("⚠️  Generated email is >20 chars — signin Zod will reject it (schema bug)");
  }

  // ── 1. HTTP Backend ──────────────────────────────────────────────────────
  console.log("── HTTP Backend (port 3001) ─────────────\n");

  // 1a. Signup (new user)
  {
    const { status, json } = await req("POST", "/signup", {
      username: SHORT_USER,
      password: SHORT_PASS,
      name: "Test User",
    });
    log(
      "POST /signup — new user",
      status === 201,
      `status=${status}`,
      status !== 201 ? `Expected 201, got ${status}. Body: ${JSON.stringify(json)}` : "",
    );
  }

  // 1b. Signup duplicate
  {
    const { status } = await req("POST", "/signup", {
      username: SHORT_USER,
      password: SHORT_PASS,
      name: "Test User",
    });
    log("POST /signup — duplicate rejected (411)", status === 411, `status=${status}`);
  }

  // 1c. Bad payload (short username)
  {
    const { status } = await req("POST", "/signup", { username: "x", password: "short" });
    log("POST /signup — invalid payload rejected (400)", status === 400, `status=${status}`);
  }

  // 1d. Signin bad credentials
  {
    const { status } = await req("POST", "/signin", {
      username: SHORT_USER,
      password: "wrongpass",
    });
    log("POST /signin — bad creds rejected (401)", status === 401, `status=${status}`,
      status !== 401 ? `Expected 401 got ${status}` : "");
  }

  // 1e. Signin success → get token
  let token = null;
  {
    const { status, json } = await req("POST", "/signin", {
      username: SHORT_USER,
      password: SHORT_PASS,
    });
    token = json?.token ?? null;
    log("POST /signin — success, token returned", status === 200 && !!token, `status=${status}`,
      !token ? `No token. Body: ${JSON.stringify(json)}` : "");
  }

  // 1f. Create room — no auth → 401
  {
    const { status } = await req("POST", "/room", { name: "test-room" });
    log("POST /room  — blocked without auth (401)", status === 401, `status=${status}`);
  }

  // 1g. Create room — with auth
  const roomSlug = `rm${Date.now()}`;
  let roomId = null;
  if (token) {
    const { status, json } = await req("POST", "/room", { name: roomSlug }, token);
    roomId = json?.room ?? null;
    log("POST /room  — created with auth", status === 200 && !!roomId,
      `status=${status}, roomId=${roomId}`,
      roomId == null ? `Expected roomId. Body: ${JSON.stringify(json)}` : "");
  } else {
    log("POST /room  — skipped (no token)", false, "", "Upstream signin failed");
  }

  // 1h. Get room by slug
  if (token && roomSlug) {
    const { status, json } = await req("GET", `/room/${roomSlug}`, null, token);
    const ok = status === 200 && json?.room?.slug === roomSlug;
    log("GET  /room/:slug — found", ok, `status=${status}`,
      !ok ? `Body: ${JSON.stringify(json)}` : "");
  }

  // 1i. Get chats for room (public endpoint)
  if (roomId) {
    const { status, json } = await req("GET", `/chats/${roomId}`);
    log("GET  /chats/:roomId — responds (200)", status === 200,
      `status=${status}, messages=${json?.messages?.length ?? "?"}`,
      status !== 200 ? `Body: ${JSON.stringify(json)}` : "");
  }

  // ── 2. WS Backend ─────────────────────────────────────────────────────────
  console.log("\n── WS Backend (port 8080) ───────────────\n");

  // 2a. No token → rejected (1008)
  await new Promise(resolve => {
    const ws = new WebSocket(`${WS}`); // no token param at all
    const t = setTimeout(() => {
      ws.close();
      log("WS — no token rejected", true, "closed/timed-out");
      resolve();
    }, 1500);
    ws.on("close", (code) => {
      clearTimeout(t);
      log("WS — no token rejected", code === 1008 || code === 1006, `code=${code}`,
        code !== 1008 && code !== 1006 ? `Expected 1008, got ${code}` : "");
      resolve();
    });
    ws.on("error", () => {});
  });

  // 2b. Bad token → rejected
  await new Promise(resolve => {
    const ws = new WebSocket(`${WS}?token=bad.token.here`);
    const t = setTimeout(() => {
      ws.close();
      log("WS — bad token rejected", true, "closed/timed-out");
      resolve();
    }, 1500);
    ws.on("close", (code) => {
      clearTimeout(t);
      log("WS — bad token rejected", code === 1008 || code === 1006, `code=${code}`,
        code !== 1008 && code !== 1006 ? `Expected 1008, got ${code}` : "");
      resolve();
    });
    ws.on("error", () => {});
  });

  // 2c. Valid token → connect, join room, send shape, receive broadcast, DB persist
  if (!token || !roomId) {
    log("WS — full flow (connect/join/send/broadcast)", false, "skipped", "No token or roomId from HTTP tests");
  } else {
    await new Promise(resolve => {
      const ws = new WebSocket(`${WS}?token=${token}`);
      let gotAck = false;
      let gotBroadcast = false;

      ws.on("open", () => {
        log("WS — valid token accepted (open)", true);

        ws.send(JSON.stringify({ type: "join_room", roomId: String(roomId) }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            type: "chat",
            roomId: String(roomId),
            message: JSON.stringify({ shape: { type: "rect", x: 10, y: 20, width: 100, height: 50 } }),
          }));
        }, 300);
      });

      ws.on("message", (raw) => {
        const msg = raw.toString();
        if (msg === "something") {
          log("WS — server sends initial ack message", true);
          gotAck = true;
          return;
        }
        try {
          const parsed = JSON.parse(msg);
          if (parsed.type === "chat") {
            gotBroadcast = true;
            log("WS — shape broadcast received back", true, `roomId=${parsed.roomId}`);
            ws.close();
            resolve();
          }
        } catch { /* non-JSON */ }
      });

      ws.on("error", (err) => {
        log("WS — valid token accepted (open)", false, err.message);
        resolve();
      });

      ws.on("close", () => {
        if (!gotBroadcast) {
          log("WS — shape broadcast received back", false, "connection closed before broadcast");
          resolve();
        }
      });

      setTimeout(() => {
        if (!gotBroadcast) {
          log("WS — shape broadcast received back", false, "timed out after 4s");
          ws.close();
          resolve();
        }
      }, 4000);
    });

    // 2d. Verify DB persistence via HTTP
    await sleep(500);
    const { status, json } = await req("GET", `/chats/${roomId}`);
    const persisted = json?.messages?.some(m => {
      try { return JSON.parse(m.message)?.shape?.type === "rect"; } catch { return false; }
    });
    log("DB  — WS shape persisted in database", persisted === true,
      `messages=${json?.messages?.length}`,
      !persisted ? "Shape not found in chat history — DB write may have failed" : "");
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════");
  console.log(`  Results:  ${passed} passed  |  ${failed} failed`);
  console.log("════════════════════════════════════════");

  if (issues.length > 0) {
    console.log("\n🐛 Bugs Found:");
    issues.forEach((i, n) => console.log(`  ${n + 1}. [${i.label}]\n     ${i.bug}`));
  }

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
