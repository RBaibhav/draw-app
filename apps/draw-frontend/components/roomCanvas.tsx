"use client";
import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import CanvasComponent from "./canvasComponent";
import Loader from "./loader";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BACKEND}?token${}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type : "join_room",
        roomId
      }))
    };
  });

  if (!socket) {
    return <Loader />;
  }

  return <CanvasComponent roomId={roomId}  socket={socket}/>;
}
