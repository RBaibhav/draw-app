import { broadcastToRoom, ConnectedUser, users } from "../registry";

export async function handleDeleteRoom(
  user: ConnectedUser,
  roomId: number,
): Promise<void> {
  // Broadcast to all clients in the room that it has been deleted
  broadcastToRoom(roomId, {
    type: "room_deleted",
    roomId,
    deletedBy: user.userId,
  });

  // Remove this room from all connected users' room sets
  for (const u of users) {
    u.rooms.delete(roomId);
  }
}
