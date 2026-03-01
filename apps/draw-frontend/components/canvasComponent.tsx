"use client";
import initCanvas from "@/draw";
import { Shape } from "@/draw/shapes/Types";
import { useEffect, useRef, useState } from "react";

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
        style={{ touchAction: "none" }}
      ></canvas>
      <div className="absolute top-0 mt-8 px-4 py-2 rounded-lg text-white">
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => setShapeType("rect")}
            id="rect"
            className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-lg shadow-xs shadow-neutral-500 hover:bg-neutral-800 active:bg-neutral-700 active:text-neutral-300"
          >
            Rectangle
          </button>
          <button
            onClick={() => setShapeType("circle")}
            id="circle"
            className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-lg shadow-xs shadow-neutral-500 hover:bg-neutral-800 active:bg-neutral-700 active:text-neutral-300"
          >
            Circle
          </button>
          <button
            onClick={() => setShapeType("line")}
            id="line"
            className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-lg shadow-xs shadow-neutral-500 hover:bg-neutral-800 active:bg-neutral-700 active:text-neutral-300"
          >
            Line
          </button>
        </div>
      </div>
    </div>
  );
}
