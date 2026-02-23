"use client";
import initCanvas from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    
    const canvas = canvasRef.current;
    initCanvas(canvas, isMouseDown);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neutral-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
      ></canvas>
    </div>
  );
}
