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
      <div className="absolute top-0 mt-8 w-xl px-4 py-2 rounded-lg text-white bg-neutral-800 shadow-md shadow-neutral-600">
        <div className="flex w-full justify-between items-center gap-4">
          <button
            onClick={() => setShapeType("rect")}
            id="rect"
            className="hover:bg-neutral-700 active:bg-neutral-500 px-2 py-1 rounded-sm"
          >
            Rectangle
          </button>
          <button
            onClick={() => setShapeType("circle")}
            id="circle"
            className=""
          >
            Circle
          </button>
          <button onClick={() => setShapeType("line")} id="line" className="">
            Line
          </button>
          <button className="">Ellipse</button>
          <button className="">Polygon</button>
        </div>
      </div>
    </div>
  );
}
