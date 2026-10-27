import { Shape } from "./Types";

export function drawLine(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "line" }>,
) {
  ctx.beginPath();
  ctx.lineWidth = shape.thickness;
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.x, shape.y);
  ctx.stroke();
}