"use client";
import initCanvas from "@/draw";
import { useEffect, useRef, useState } from "react";

export default function CanvasComponent({ roomId, socket }: { roomId: string, socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
 
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    let cleanUp: (() => void) | undefined;
    (async () => {
      cleanUp = await initCanvas(canvas, isMouseDown, roomId, socket);
    })();

    return () => {
      cleanUp?.();
    };
  }, [roomId, socket]);
  
 

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-neutral-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
      ></canvas>
      <div className="absolute top-0 mt-8 w-xl px-4 py-2 rounded-lg text-white bg-neutral-800 shadow-md shadow-neutral-600">
        <div className="flex w-full justify-between items-center gap-4">
          <button className="">Rectangle</button>
          <button className="">Circle</button>
          <button className="">Triangle</button>
          <button className="">Ellipse</button>
          <button className="">Polygon</button>
        </div>
      </div>
    </div>
  );
}
