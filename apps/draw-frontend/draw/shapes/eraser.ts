import { Shape } from "./Types";

export function drawEraser(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "eraser" }>,
) {
  if (shape.stroke.length === 0) return;

  const [first, ...rest] = shape.stroke;

  ctx.beginPath();
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = shape.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(first.x, first.y);

  for (const pt of rest) {
    ctx.lineTo(pt.x, pt.y);
  }

  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}
