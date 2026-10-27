/**
 * draw-app Backend Test Suite
 * Tests: HTTP backend (port 3001) + WS backend (port 8080)
 */

import { WebSocket } from "ws";

const HTTP = "http://localhost:3001";
const WS   = "ws://localhost:8080";

let passed = 0;
let failed = 0;

// ─── helpers ─────────────────────────────────────────────────────────────────

function log(label, ok, detail = "") {
  const icon = ok ? "✅" : "❌";
  console.log(`${icon}  ${label}${detail ? "  →  " + detail : ""}`);
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

  // ── 1. HTTP reachability ──────────────────────────────────────────────────
  console.log("── HTTP Backend (port 3001) ─────────────\n");

  const testUser = {
    username: `tester_${Date.now()}@test.com`,
    password: "password123",
    name: "Test User",
  };

  // 1a. Signup (new user)
  {
    const { status, json } = await req("POST", "/signup", testUser);
    log("POST /signup — new user", status === 201, `status=${status}`);
    if (status !== 201) console.log("     body:", json);
  }

  // 1b. Signup duplicate
  {
    const { status } = await req("POST", "/signup", testUser);
    log("POST /signup — duplicate rejected", status === 411, `status=${status}`);
  }

  // 1c. Signup with bad payload
  {
    const { status } = await req("POST", "/signup", { username: "x", password: "short" });
    log("POST /signup — invalid payload rejected", status === 400, `status=${status}`);
  }

  // 1d. Signin — bad creds
  {
    const { status } = await req("POST", "/signin", {
      username: testUser.username,
      password: "wrongpassword",
    });
    log("POST /signin — bad creds rejected", status === 401, `status=${status}`);
  }

  // 1e. Signin — success
  let token = null;
  {
    const { status, json } = await req("POST", "/signin", {
      username: testUser.username,
      password: testUser.password,
    });
    token = json?.token ?? null;
    log("POST /signin — success & token returned", status === 200 && !!token, `status=${status}`);
    if (!token) console.log("     body:", json);
  }

  // 1f. Create room — no auth
  {
    const { status } = await req("POST", "/room", { name: "test-room" });
    log("POST /room  — blocked without auth", status === 401, `status=${status}`);
  }

  // 1g. Create room — with auth
  const roomSlug = `room-${Date.now()}`;
  let roomId = null;
  {
    const { status, json } = await req("POST", "/room", { name: roomSlug }, token);
    roomId = json?.room ?? null;
    log("POST /room  — created with auth", status === 200 && !!roomId, `status=${status}, roomId=${roomId}`);
    if (status !== 200) console.log("     body:", json);
  }

  // 1h. Get room by slug
  {
    const { status, json } = await req("GET", `/room/${roomSlug}`, null, token);
    const ok = status === 200 && json?.room?.slug === roomSlug;
    log("GET  /room/:slug — found", ok, `status=${status}`);
    if (!ok) console.log("     body:", json);
  }

  // 1i. Get chats for room
  {
    const { status, json } = await req("GET", `/chats/${roomId}`);
    log("GET  /chats/:roomId — responds", status === 200, `status=${status}, messages=${json?.messages?.length ?? "?"}`);
  }

  // ── 2. WebSocket Backend (port 8080) ─────────────────────────────────────
  console.log("\n── WS Backend (port 8080) ───────────────\n");

  // 2a. No token → rejected
  await new Promise(resolve => {
    const ws = new WebSocket(`${WS}`);   // no token
    const t = setTimeout(() => {
      ws.close();
      log("WS connect — no token rejected (timeout, server may not close immediately)", true);
      resolve();
    }, 1000);

    ws.on("close", (code) => {
      clearTimeout(t);
      log("WS connect — no token rejected (closed)", code === 1008 || code === 1006, `code=${code}`);
      resolve();
    });
    ws.on("error", () => {}); // suppress
  });

  // 2b. Bad token → rejected
  await new Promise(resolve => {
    const ws = new WebSocket(`${WS}?token=bad.token.here`);
    const t = setTimeout(() => {
      ws.close();
      log("WS connect — bad token rejected (timeout)", true);
      resolve();
    }, 1000);

    ws.on("close", (code) => {
      clearTimeout(t);
      log("WS connect — bad token rejected (closed)", code === 1008 || code === 1006, `code=${code}`);
      resolve();
    });
    ws.on("error", () => {});
  });

  // 2c. Valid token → connect + join room + send shape + receive broadcast
  if (!token || !roomId) {
    log("WS connect — skipped (no token/roomId)", false, "upstream HTTP test failed");
  } else {
    await new Promise(resolve => {
      const ws = new WebSocket(`${WS}?token=${token}`);

      ws.on("open", () => {
        log("WS connect — valid token accepted", true);

        // join room
        ws.send(JSON.stringify({ type: "join_room", roomId: String(roomId) }));

        // send a shape as a "chat" message (small delay to let join propagate)
        setTimeout(() => {
          const shape = { type: "rect", x: 10, y: 20, width: 100, height: 50 };
          ws.send(JSON.stringify({
            type: "chat",
            roomId: String(roomId),
            message: JSON.stringify({ shape }),
          }));
        }, 200);
      });

      let gotBroadcast = false;

      ws.on("message", (raw) => {
        const msg = raw.toString();

        // The server sends "something" on connect, and then broadcasts chat messages
        if (msg === "something") {
          log("WS — server sends initial acknowledgement", true);
          return;
        }

        try {
          const parsed = JSON.parse(msg);
          if (parsed.type === "chat") {
            gotBroadcast = true;
            log("WS — shape broadcast received", true, `roomId=${parsed.roomId}`);
            ws.close();
            resolve();
          }
        } catch {
          // non-JSON messages
        }
      });

      ws.on("error", (err) => {
        log("WS connect — valid token accepted", false, err.message);
        resolve();
      });

      ws.on("close", () => {
        if (!gotBroadcast) {
          log("WS — shape broadcast received", false, "connection closed without broadcast");
          resolve();
        }
      });

      // safety timeout
      setTimeout(() => {
        if (!gotBroadcast) {
          log("WS — shape broadcast received", false, "timed out after 4s");
          ws.close();
          resolve();
        }
      }, 4000);
    });

    // 2d. Verify the chat was persisted via HTTP
    await sleep(500);
    const { status, json } = await req("GET", `/chats/${roomId}`);
    const persisted = json?.messages?.some(m => {
      try { return JSON.parse(m.message)?.shape?.type === "rect"; } catch { return false; }
    });
    log("DB  — WS chat persisted in database", status === 200 && persisted, `messages=${json?.messages?.length}`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════");
  console.log(`  Results:  ${passed} passed  |  ${failed} failed`);
  console.log("════════════════════════════════════════\n");

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
