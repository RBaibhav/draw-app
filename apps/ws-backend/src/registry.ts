import { WebSocket } from "ws";

export interface ConnectedUser {
  ws: WebSocket;
  userId: string;
  rooms: Set<number>;
}

/** In-memory registry of all active WebSocket connections. */
export const users: ConnectedUser[] = [];

/** Adds a new user to the registry. */
export function registerUser(user: ConnectedUser): void {
  users.push(user);
}

/** Removes a user from the registry on disconnect. */
export function unregisterUser(user: ConnectedUser): void {
  const idx = users.indexOf(user);
  if (idx !== -1) users.splice(idx, 1);
}

/** Sends a JSON payload to every open connection in a room, optionally excluding one socket. */
export function broadcastToRoom(
  roomId: number,
  payload: unknown,
  excludeWs?: WebSocket,
): void {
  const data = JSON.stringify(payload);
  for (const user of users) {
    if (!user.rooms.has(roomId)) continue;
    if (user.ws === excludeWs) continue;
    if (user.ws.readyState !== WebSocket.OPEN) continue;
    user.ws.send(data);
  }
}
