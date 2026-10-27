"use client";
import { HTTP_BACKEND, WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import CanvasComponent from "./CanvasComponent";
import Loader from "@/components/ui/Loader";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [resolvedRoomId, setResolvedRoomId] = useState<number | null>(null);
  const [roomSlug, setRoomSlug] = useState<string>(roomId);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let wsInstance: WebSocket | null = null;
    let isMounted = true;

    async function initRoom() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          setAuthError(true);
          setLoading(false);
        }
        return;
      }

      try {
        // Resolve room and automatically record membership via /room/join
        const isNumeric = !isNaN(Number(roomId));
        const joinPayload = isNumeric
          ? { roomId: Number(roomId) }
          : { slug: roomId };

        let actualId: number;
        let actualSlug: string;

        try {
          const joinRes = await axios.post(
            `${HTTP_BACKEND}/room/join`,
            joinPayload,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          actualId = joinRes.data.room.id;
          actualSlug = joinRes.data.room.slug;
        } catch {
          // If join failed, try fetching room info directly
          const fetchUrl = isNumeric
            ? `${HTTP_BACKEND}/room/id/${roomId}`
            : `${HTTP_BACKEND}/room/${roomId}`;
          const res = await axios.get(fetchUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          actualId = res.data.room.id;
          actualSlug = res.data.room.slug;
        }

        if (!isMounted) return;
        setResolvedRoomId(actualId);
        setRoomSlug(actualSlug);

        // Connect to WebSocket with token
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
        wsInstance = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setSocket(ws);
          setLoading(false);
          ws.send(
            JSON.stringify({
              type: "join_room",
              roomId: actualId,
            }),
          );
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          if (isMounted) {
            setErrorMessage("Failed to connect to real-time server");
            setLoading(false);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };
      } catch (err) {
        console.error("Error setting up room:", err);
        if (isMounted) {
          setErrorMessage("Room not found or you don't have access.");
          setLoading(false);
        }
      }
    }

    initRoom();

    return () => {
      isMounted = false;
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.close();
      }
    };
  }, [roomId]);

  if (authError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-white p-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-neutral-400 mb-6 text-sm">
            You must be signed in to join collaborative whiteboard room{" "}
            <span className="font-semibold text-neutral-200">"{roomId}"</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/signin?redirect=/canvas/${roomId}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-lg"
            >
              Sign In to Join
            </Link>
            <Link
              href="/"
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-white p-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Unable to Join Room</h2>
          <p className="text-neutral-400 mb-6 text-sm">{errorMessage}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-medium px-6 py-3 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !socket || resolvedRoomId === null) {
    return <Loader />;
  }

  return (
    <CanvasComponent
      roomId={String(resolvedRoomId)}
      roomSlug={roomSlug}
      socket={socket}
    />
  );
}

