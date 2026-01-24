import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
import { prisma } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

// ugly state management
const users: Users[] = [];

function checksUsers(token: string): string | null {
  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  ws.on("error", console.error);
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");
  const userId = checksUsers(token as string);

  if (!userId) {
    ws.close(1008, "Unauthorized");
    return;
  }

  users.push({
    ws: ws,
    userId: userId,
    rooms: [],
  });

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const { roomId, message } = parsedData;

      await prisma.chat.create({
        data: {
          userId: userId,
          roomId: roomId,
          message: message,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId: roomId,
            }),
          );
        }
      });
    }

    ws.send("pong");
  });

  ws.send("something");
});
