import { prisma } from "@repo/db";
import { broadcastToRoom, ConnectedUser } from "../registry";

export async function handleClearCanvas(
  user: ConnectedUser,
  roomId: number,
): Promise<void> {
  try {
    await prisma.shape.deleteMany({ where: { roomId } });
  } catch (err) {
    console.error("Failed to clear room shapes:", err);
  }

  broadcastToRoom(roomId, {
    type: "clear_canvas",
    roomId,
    userId: user.userId,
  });
}
