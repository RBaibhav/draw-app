"use client";
import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import CanvasComponent from "./canvasComponent";
import Loader from "./loader";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in — loader stays visible
    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected:", ws);
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [roomId]);

  if (!socket) {
    return <Loader />;
  }

  return <CanvasComponent roomId={roomId} socket={socket} />;
}
