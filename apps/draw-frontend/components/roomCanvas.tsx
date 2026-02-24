"use client";
import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import CanvasComponent from "./canvasComponent";
import Loader from "./loader";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzIxMzA5OC1jMGE3LTRlNmItYjljNC1mMGMyMzBlZjAzNzQiLCJpYXQiOjE3NzE5MzE4NjN9.qYDOknVbwXKUBU2Zvd7L_LfKQF2clzStDgTLkTLoTfs" ;
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
