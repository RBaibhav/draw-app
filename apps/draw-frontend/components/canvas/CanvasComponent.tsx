"use client";
import initCanvas from "@/draw";
import type { UndoRef } from "@/draw";
import { clearRoomShapes, deleteRoom } from "@/draw/http";
import { Shape } from "@/draw/shapes/Types";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  Eraser,
  MoveRight,
  PencilIcon,
  RectangleHorizontal,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";

export default function CanvasComponent({
  roomId,
  roomSlug,
  socket,
  isAdmin = false,
}: {
  roomId: string;
  roomSlug?: string;
  socket: WebSocket;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const [shapeType, setShapeType] = useState<Shape["type"] | "">("pencil");
  const shapeTypeRef = useRef<Shape["type"] | "">("pencil");
  const undoRef = useRef<UndoRef["current"]>(null);
  const [copied, setCopied] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Listen for real-time room deletion
  useEffect(() => {
    const handleWsMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "room_deleted") {
          alert("This room has been deleted by the admin.");
          router.push("/rooms");
        }
      } catch {
        // ignore non-json messages
      }
    };

    socket.addEventListener("message", handleWsMessage);
    return () => {
      socket.removeEventListener("message", handleWsMessage);
    };
  }, [socket, router]);

  // Keep the ref in sync with state so the canvas closure always sees the latest tool
  shapeTypeRef.current = shapeType;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    let cleanUp: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const teardown = await initCanvas(
        canvas,
        isMouseDown,
        roomId,
        socket,
        shapeTypeRef,
        undoRef,
      );
      // If the effect was cleaned up before initCanvas finished (React StrictMode
      // double-invoke), immediately call teardown so stale listeners don't linger.
      if (cancelled) {
        teardown?.();
        return;
      }
      cleanUp = teardown;
    })();

    return () => {
      cancelled = true;
      cleanUp?.();
    };
  // shapeType intentionally omitted — tool changes go through shapeTypeRef, not re-init
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socket]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleClearCanvas = async () => {
    if (!confirm("Are you sure you want to clear the whiteboard for everyone in this room?")) {
      return;
    }

    setIsClearing(true);
    try {
      // Send WebSocket clear event
      socket.send(
        JSON.stringify({
          type: "clear_canvas",
          roomId,
        }),
      );

      // Also call HTTP backend to ensure persistent deletion
      const token = localStorage.getItem("token");
      if (token) {
        await clearRoomShapes(roomId, token);
      }
    } catch (err) {
      console.error("Error clearing canvas:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (
      !confirm(
        `Are you sure you want to permanently delete room "${roomSlug || roomId}"?\n\nAll whiteboard drawings will be permanently lost and all participants disconnected.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Broadcast delete_room to other connected clients via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "delete_room",
            roomId: Number(roomId),
          }),
        );
      }

      // Call HTTP backend to delete the room from database
      const res = await deleteRoom(roomId, token);
      if (res.success) {
        router.push("/rooms");
      } else {
        alert(res.message || "Failed to delete room");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  const tools: { type: Shape["type"] | ""; icon: React.ReactNode; title: string }[] = [
    { type: "pencil", icon: <PencilIcon size={18} />, title: "Pencil (Freehand)" },
    { type: "rect", icon: <RectangleHorizontal size={18} />, title: "Rectangle" },
    { type: "circle", icon: <Circle size={18} />, title: "Circle" },
    { type: "line", icon: <MoveRight size={18} />, title: "Line" },
    { type: "eraser", icon: <Eraser size={18} />, title: "Eraser" },
  ];

  const displayName = roomSlug || `Room #${roomId}`;

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Room Badge & Back */}
        <div className="pointer-events-auto flex items-center gap-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl px-4 py-2 shadow-xl">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition p-1 hover:bg-neutral-800 rounded-lg"
            title="Back to Rooms"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-5 w-px bg-neutral-800" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-neutral-100 max-w-[180px] sm:max-w-xs truncate">
                {displayName}
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Share, Clear, Delete) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl px-3 py-2 shadow-xl">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/30"
            }`}
            title="Copy shareable room link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Room</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearCanvas}
            disabled={isClearing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition disabled:opacity-50 cursor-pointer"
            title="Clear whiteboard drawings"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Canvas</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleDeleteRoom}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:text-white hover:bg-red-600/80 border border-red-500/30 transition disabled:opacity-50 cursor-pointer"
              title="Delete entire room permanently (Admin only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete Room</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ touchAction: "none" }}
      />

      {/* Floating Center Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-1.5 shadow-2xl">
        {tools.map((tool) => (
          <div key={tool.type} title={tool.title}>
            <IconButton
              onClick={() =>
                setShapeType((prev) => (prev === tool.type ? "" : tool.type))
              }
              icon={tool.icon}
              activated={shapeType === tool.type}
            />
          </div>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Undo button */}
        <div title="Undo last stroke (Ctrl+Z)">
          <IconButton
            onClick={() => undoRef.current?.()}
            icon={<Undo2 size={18} />}
            activated={false}
          />
        </div>
      </div>

      {/* Hint at the bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-3">
        <span className="text-neutral-500 text-xs bg-neutral-900/60 backdrop-blur-sm px-3 py-1 rounded-full border border-neutral-800">
          Tip: Anyone with this link can join and draw in real-time
        </span>
        <span className="text-neutral-500 text-xs bg-neutral-900/60 backdrop-blur-sm px-3 py-1 rounded-full border border-neutral-800">
          <kbd className="font-mono text-neutral-400">Ctrl+Z</kbd> to undo
        </span>
      </div>
    </div>
  );
}

