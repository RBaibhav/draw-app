import "dotenv/config";
import { WebSocketServer } from "ws";
import { extractToken, verifyToken } from "./auth";
import { registerUser, unregisterUser } from "./registry";
import { dispatch } from "./handlers/dispatch";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws, request) => {
  ws.on("error", console.error);

  // ── Authentication ──────────────────────────────────────────────────────

  const token = extractToken(request.url);
  const userId = token ? verifyToken(token) : null;

  if (!userId) {
    ws.close(1008, "Unauthorized");
    return;
  }

  // ── Register connection ─────────────────────────────────────────────────

  const user = { ws, userId, rooms: new Set<number>() };
  registerUser(user);

  // Send handshake acknowledgment
  ws.send("something");

  // ── Message routing ─────────────────────────────────────────────────────

  ws.on("message", async (rawData) => {
    try {
      await dispatch(user, rawData);
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  // ── Cleanup on disconnect ───────────────────────────────────────────────

  ws.on("close", () => unregisterUser(user));
});

console.log(`WebSocket server listening on port ${PORT}`);
