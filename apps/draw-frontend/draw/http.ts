import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { Shape } from "./shapes/Types";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);

  const messages = res.data.messages;
  const shapes = messages
    .map((x: { message: string }) => {
      try {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
      } catch {
        return null;
      }
    })
    .filter(Boolean); // Remove nulls

  return shapes;
}
