import { Shape } from "./Types";

export function drawPencil(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "pencil" }>,
) {
  if (shape.stroke.length === 0) return;

  ctx.beginPath();
  ctx.lineWidth = shape.thickness;
  ctx.moveTo(shape.stroke[0].x, shape.stroke[0].y);

  for (let i = 1; i < shape.stroke.length; i++) {
    ctx.lineTo(shape.stroke[i].x, shape.stroke[i].y);
  }

  ctx.stroke();
}
