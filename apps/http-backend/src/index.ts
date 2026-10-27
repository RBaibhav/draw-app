import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { roomsRouter } from "./routes/rooms";
import { shapesRouter } from "./routes/shapes";

const app = express();
const PORT = process.env.PORT || 3002;

// ── Global middleware ───────────────────────────────────────────────────────

app.use(express.json());
app.use(cors());

// ── Routes ──────────────────────────────────────────────────────────────────

app.use("/", authRouter);       // POST /signup  POST /signin
app.use("/room", roomsRouter);  // POST /room  POST /room/join  GET /room/:slug  GET /room/id/:roomId
app.use("/rooms", roomsRouter); // GET /rooms  (list user's rooms)
app.use("/shapes", shapesRouter); // GET /shapes/:roomId  DELETE /shapes/:roomId

// ── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
