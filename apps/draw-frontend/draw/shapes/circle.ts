import { Shape } from "..";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "circle" }>
) {
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
  ctx.stroke();
}