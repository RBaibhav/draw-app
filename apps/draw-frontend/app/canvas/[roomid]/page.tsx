"use client";
import { useEffect, useRef } from "react";
import { createContext } from "vm";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match display size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let startX = 0;
    let startY = 0;
    const handleMove = (e: PointerEvent) => {
      if (isMouseDown.current) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(startX, startY, width, height);
      }
    };

    const handleDown = (e: PointerEvent) => {
      isMouseDown.current = true;
      startX = e.clientX;
      startY = e.clientY;
      
    };

    const handleUp = (e: PointerEvent) => {
      isMouseDown.current = false;
    };

    canvas.addEventListener("pointerdown", handleDown);
    canvas.addEventListener("pointerup", handleUp);
    canvas.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointerdown", handleDown);
      canvas.removeEventListener("pointerup", handleUp);
      canvas.removeEventListener("pointermove", handleMove);
    };
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