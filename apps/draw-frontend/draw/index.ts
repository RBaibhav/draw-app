

type Shape {
  type: "rect" 
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "line"
  centerX: number;
  centerY: number;
  radius: number;
}




export default function initCanvas(canvas: HTMLCanvasElement, isMouseDown: { current: boolean }) {
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return;

  // Set canvas size to match display size
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let startX = 0;
  let startY = 0;
  const handleMove = (e: PointerEvent) => {
    if (isMouseDown.current) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0 )";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
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
}
