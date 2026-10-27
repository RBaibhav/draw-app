import { RawData } from "ws";
import { ConnectedUser } from "../registry";
import { handleJoinRoom } from "./joinRoom";
import { handleLeaveRoom } from "./leaveRoom";
import { handleDrawShape } from "./drawShape";
import { handleClearCanvas } from "./clearCanvas";
import { handleDeleteRoom } from "./deleteRoom";

/** Parses an incoming WebSocket frame and routes it to the correct handler. */
export async function dispatch(
  user: ConnectedUser,
  rawData: RawData,
): Promise<void> {
  const text = rawData.toString();
  const msg = JSON.parse(text);
  const roomId = Number(msg.roomId);

  switch (msg.type) {
    case "join_room":
      if (!isNaN(roomId)) await handleJoinRoom(user, roomId);
      break;

    case "leave_room":
      if (!isNaN(roomId)) handleLeaveRoom(user, roomId);
      break;

    case "draw_shape":
      if (!isNaN(roomId) && msg.shape) await handleDrawShape(user, roomId, msg.shape);
      break;

    case "clear_canvas":
      if (!isNaN(roomId)) await handleClearCanvas(user, roomId);
      break;

    case "delete_room":
      if (!isNaN(roomId)) await handleDeleteRoom(user, roomId);
      break;

    default:
      // Unknown message types are silently ignored
      break;
  }
}
