import { WebSocket } from "ws";
import { prisma } from "@repo/db";
import { broadcastToRoom, ConnectedUser, users } from "../registry";

export async function handleJoinRoom(
  user: ConnectedUser,
  roomId: number,
): Promise<void> {
  user.rooms.add(roomId);

  // Record membership — silently ignore conflicts
  try {
    await prisma.roomMember.upsert({
      where: { roomId_userId: { roomId, userId: user.userId } },
      update: {},
      create: { roomId, userId: user.userId, role: "member" },
    });
  } catch {
    // Duplicate or constraint error — not fatal
  }

  const memberCount = users.filter((u) => u.rooms.has(roomId)).length;

  user.ws.send(JSON.stringify({ type: "joined_room", roomId, memberCount }));

  broadcastToRoom(
    roomId,
    { type: "user_joined", userId: user.userId, roomId, memberCount },
    user.ws,
  );
}
