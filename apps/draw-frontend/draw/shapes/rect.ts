import { Shape } from "./Types";

export function drawRect(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "rect" }>,
) {
  ctx.beginPath();
  ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
}