import { Shape } from "./Types";

export function drawRect(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "rect" }>
) {
  ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
}