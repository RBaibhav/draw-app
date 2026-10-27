"use client";
import initCanvas from "@/draw";
import { Shape } from "@/draw/shapes/Types";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./iconButton";
import {
  Circle,
  Eraser,
  MoveRight,
  PencilIcon,
  RectangleHorizontal,
} from "lucide-react";

export default function CanvasComponent({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const [shapeType, setShapeType] = useState<Shape["type"] | "">("");

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    let cleanUp: (() => void) | undefined;
    (async () => {
      cleanUp = await initCanvas(
        canvas,
        isMouseDown,
        roomId,
        socket,
        shapeType,
      );
    })();

    return () => {
      cleanUp?.();
    };
  }, [roomId, shapeType, socket]);

  const tools: { type: Shape["type"] | ""; icon: React.ReactNode; title: string }[] = [
    { type: "rect", icon: <RectangleHorizontal size={18} />, title: "Rectangle" },
    { type: "circle", icon: <Circle size={18} />, title: "Circle" },
    { type: "line", icon: <MoveRight size={18} />, title: "Line" },
    { type: "pencil", icon: <PencilIcon size={18} />, title: "Pencil" },
    { type: "eraser", icon: <Eraser size={18} />, title: "Eraser" },
  ];

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-neutral-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
      />
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-xl px-3 py-2 shadow-2xl">
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
      </div>
    </div>
  );
}
