import { Shape } from "./Types";

export function drawLine(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "line" }>,
) {
  ctx.lineWidth = shape.thickness;
  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.x, shape.y);
  ctx.stroke();
}