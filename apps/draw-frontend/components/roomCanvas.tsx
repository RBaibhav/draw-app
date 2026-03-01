"use client";
import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import CanvasComponent from "./canvasComponent";
import Loader from "./loader";
import { Shape } from "@/draw";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYzVhMzc5NC02ZmM2LTRjNzMtOGUyOS01MWE0N2U2M2NkZWEiLCJpYXQiOjE3NzE5Mzk3Mjl9.7q6PRd2hTwn4wInaFunUQBAeAosa63yMlMQwXp-QW8U"
    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected:", ws);
      setSocket(ws);
      ws.send(JSON.stringify({
        type : "join_room",
        roomId
      }))
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

  }, [roomId]);

  if (!socket) {
    return <Loader />;
  }

  return <CanvasComponent roomId={roomId}  socket={socket}/>;
}
