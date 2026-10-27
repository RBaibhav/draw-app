import { prisma } from "@repo/db";
import { broadcastToRoom, ConnectedUser } from "../registry";

export async function handleDrawShape(
  user: ConnectedUser,
  roomId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shape: Record<string, any>,
): Promise<void> {
  let shapeId: number | undefined;

  try {
    const saved = await prisma.shape.create({
      data: {
        userId: user.userId,
        roomId,
        type: shape.type ?? "unknown",
        shapeData: JSON.stringify(shape),
      },
    });
    shapeId = saved.id;
  } catch (err) {
    console.error("Failed to persist shape:", err);
  }

  broadcastToRoom(roomId, {
    type: "draw_shape",
    roomId,
    userId: user.userId,
    shape,
    shapeId,
  });
}
