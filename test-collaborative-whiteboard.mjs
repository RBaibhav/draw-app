/**
 * Collaborative Whiteboard End-to-End Test Suite
 * Tests redesigned schema, RoomMember, Shape models, WebSocket draw_shape & clear_canvas, and room joining
 */

import { WebSocket } from "ws";

const HTTP = "http://localhost:3001";
const WS = "ws://localhost:8080";

let passed = 0;
let failed = 0;

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
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("\n════════════════════════════════════════════════════════════");
  console.log("  Collaborative Whiteboard Architecture & WebSocket Test Suite");
  console.log("════════════════════════════════════════════════════════════\n");

  const timestamp = Date.now();
  const user1 = {
    username: `alice_${timestamp}@collab.com`,
    password: "password123",
    name: "Alice Designer",
  };
  const user2 = {
    username: `bob_${timestamp}@collab.com`,
    password: "password123",
    name: "Bob Collaborator",
  };

  // 1. Signup & Signin Alice
  await req("POST", "/signup", user1);
  const { json: aliceAuth } = await req("POST", "/signin", {
    username: user1.username,
    password: user1.password,
  });
  const aliceToken = aliceAuth?.token;
  log("User 1 (Alice) authenticated", !!aliceToken);

  // 2. Signup & Signin Bob
  await req("POST", "/signup", user2);
  const { json: bobAuth } = await req("POST", "/signin", {
    username: user2.username,
    password: user2.password,
  });
  const bobToken = bobAuth?.token;
  log("User 2 (Bob) authenticated", !!bobToken);

  // 3. Alice creates a room
  const roomSlug = `whiteboard-${timestamp}`;
  const { status: createStatus, json: createJson } = await req(
    "POST",
    "/room",
    { name: roomSlug },
    aliceToken,
  );
  const roomId = createJson?.room;
  log(
    "Alice creates room via POST /room",
    createStatus === 200 && !!roomId,
    `roomId=${roomId}, slug=${roomSlug}`,
  );

  // 4. Bob joins room via POST /room/join (Frontend Room Join Logic)
  const { status: joinStatus, json: joinJson } = await req(
    "POST",
    "/room/join",
    { slug: roomSlug },
    bobToken,
  );
  log(
    "Bob joins room via POST /room/join",
    joinStatus === 200 && joinJson?.room?.id === roomId,
    `joined roomId=${joinJson?.room?.id}`,
  );

  // 5. Verify room listing for Alice and Bob (GET /rooms)
  const { json: aliceRooms } = await req("GET", "/rooms", null, aliceToken);
  const aliceHasRoom = aliceRooms?.rooms?.some((r) => r.id === roomId);
  log("Alice sees room in GET /rooms", !!aliceHasRoom);

  const { json: bobRooms } = await req("GET", "/rooms", null, bobToken);
  const bobHasRoom = bobRooms?.rooms?.some((r) => r.id === roomId);
  log("Bob sees joined room in GET /rooms", !!bobHasRoom);

  // 6. WebSocket Multiplayer Collaboration Test
  console.log("\n── Real-time WebSocket Collaboration ───────\n");

  const aliceWs = new WebSocket(`${WS}?token=${aliceToken}`);
  const bobWs = new WebSocket(`${WS}?token=${bobToken}`);

  await Promise.all([
    new Promise((resolve) => aliceWs.on("open", resolve)),
    new Promise((resolve) => bobWs.on("open", resolve)),
  ]);
  log("Both Alice & Bob connected to WebSocket server", true);

  // Set up message listeners
  let bobReceivedShape = null;
  let aliceReceivedShape = null;
  let bobReceivedClear = false;

  bobWs.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "draw_shape") {
        bobReceivedShape = msg.shape;
      } else if (msg.type === "clear_canvas") {
        bobReceivedClear = true;
      }
    } catch {}
  });

  aliceWs.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "draw_shape") {
        aliceReceivedShape = msg.shape;
      }
    } catch {}
  });

  // Both join room via WS
  aliceWs.send(JSON.stringify({ type: "join_room", roomId }));
  bobWs.send(JSON.stringify({ type: "join_room", roomId }));
  await sleep(300);

  // Alice draws a rectangle
  const rectShape = {
    type: "rect",
    startX: 100,
    startY: 150,
    width: 250,
    height: 120,
  };
  aliceWs.send(
    JSON.stringify({
      type: "draw_shape",
      roomId,
      shape: rectShape,
    }),
  );

  await sleep(500);
  log(
    "Bob received Alice's draw_shape event in real-time",
    bobReceivedShape?.type === "rect" && bobReceivedShape?.width === 250,
    `type=${bobReceivedShape?.type}`,
  );

  // Bob draws a pencil stroke
  const pencilShape = {
    type: "pencil",
    stroke: [
      { x: 10, y: 10 },
      { x: 20, y: 25 },
      { x: 30, y: 40 },
    ],
    thickness: 2,
  };
  bobWs.send(
    JSON.stringify({
      type: "draw_shape",
      roomId,
      shape: pencilShape,
    }),
  );

  await sleep(500);
  log(
    "Alice received Bob's draw_shape event in real-time",
    aliceReceivedShape?.type === "pencil" &&
      aliceReceivedShape?.stroke?.length === 3,
    `type=${aliceReceivedShape?.type}`,
  );

  // 7. Verify shapes persisted in database via GET /shapes/:roomId
  const { status: shapesStatus, json: shapesJson } = await req(
    "GET",
    `/shapes/${roomId}`,
  );
  const shapes = shapesJson?.shapes || [];
  const hasRect = shapes.some((s) => s.type === "rect" && s.width === 250);
  const hasPencil = shapes.some((s) => s.type === "pencil");
  log(
    "GET /shapes/:roomId — shapes persisted in database",
    shapesStatus === 200 && hasRect && hasPencil,
    `total shapes stored=${shapes.length}`,
  );

  // 8. Test Canvas Clear synchronization
  aliceWs.send(JSON.stringify({ type: "clear_canvas", roomId }));
  await sleep(500);

  log(
    "Bob received clear_canvas event in real-time",
    bobReceivedClear === true,
  );

  const { json: clearedShapesJson } = await req("GET", `/shapes/${roomId}`);
  log(
    "GET /shapes/:roomId — confirms canvas cleared in database",
    clearedShapesJson?.shapes?.length === 0,
    `remaining shapes=${clearedShapesJson?.shapes?.length}`,
  );

  aliceWs.close();
  bobWs.close();

  // Summary
  console.log("\n════════════════════════════════════════════════════════════");
  console.log(`  Collaborative Whiteboard Results: ${passed} passed | ${failed} failed`);
  console.log("════════════════════════════════════════════════════════════\n");

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
