import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { Shape } from "./shapes/Types";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    const shapes = res.data?.shapes;
    return Array.isArray(shapes) ? (shapes as Shape[]) : [];
  } catch {
    return [];
  }
}

export async function clearRoomShapes(
  roomId: string,
  token: string,
): Promise<boolean> {
  try {
    await axios.delete(`${HTTP_BACKEND}/shapes/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("Failed to clear shapes:", err);
    return false;
  }
}
