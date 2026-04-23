"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: { messages: string }[];
  id: string;
}) {
  const { loading, socket } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState(messages);

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          roomId: id,
          type: "join_room",
        }),
      );
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData === "chat") {
          setChats((prev) => [...prev, { messages: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((msg, index) => (
        <div key={index}>{msg.messages}</div>
      ))}
      <input type="text" value={currentMessage} placeholder="Sent Chat" onChange={(e) => setCurrentMessage(e.target.value)} />
      <button onClick={() => {
        socket?.send(JSON.stringify({
          type: "chat",
          room: id,
          message: currentMessage
        }))
        setCurrentMessage("");
      }}></button>
    </div>
  );
}
