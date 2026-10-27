import { broadcastToRoom, ConnectedUser } from "../registry";

export function handleLeaveRoom(user: ConnectedUser, roomId: number): void {
  user.rooms.delete(roomId);

  broadcastToRoom(
    roomId,
    { type: "user_left", userId: user.userId, roomId },
    user.ws,
  );
}
