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

export async function deleteRoom(
  identifier: string | number,
  token: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await axios.delete(`${HTTP_BACKEND}/room/${identifier}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: res.data?.message };
  } catch (err: any) {
    console.error("Failed to delete room:", err);
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to delete room";
    return { success: false, message: msg };
  }
}

export async function leaveRoom(
  identifier: string | number,
  token: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const isNumeric = !isNaN(Number(identifier));
    const payload = isNumeric
      ? { roomId: Number(identifier) }
      : { slug: String(identifier) };

    const res = await axios.post(`${HTTP_BACKEND}/room/leave`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: res.data?.message };
  } catch (err: any) {
    console.error("Failed to leave room:", err);
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to leave room";
    return { success: false, message: msg };
  }
}

