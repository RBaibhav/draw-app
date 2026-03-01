"use client";
import initCanvas from "@/draw";
import { Shape } from "@/draw/shapes/Types";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./iconButton";
import { Circle, MoveRight, PencilIcon, RectangleHorizontal } from "lucide-react";

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

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-neutral-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }} // Disable default browser touch actions
      ></canvas>
      <div className="absolute top-0 mt-8 px-4 py-2 rounded-lg text-white">
        <div className="flex justify-between items-center gap-2">
          <IconButton
            onClick={() => setShapeType("rect")}
            icon={<RectangleHorizontal />}
            activated={shapeType === "rect"}
          />
          <IconButton
            onClick={() => setShapeType("circle")}
            icon={<Circle />}
            activated={shapeType === "circle"}
          />
          <IconButton
            onClick={() => setShapeType("line")}
            icon={<MoveRight />}
            activated={shapeType === "line"}
          />
          <IconButton
            onClick={() => setShapeType("pencil")}
            icon={<PencilIcon/>}
            activated={shapeType === "pencil"}
          />
        </div>
      </div>
    </div>
  );
}
