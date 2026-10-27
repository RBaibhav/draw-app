import { Shape } from "./Types";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "circle" }>,
) {
  const radiusX = Math.abs(shape.x - shape.startX) * 0.5;
  const radiusY = Math.abs(shape.y - shape.startY) * 0.5;
  const centerX = shape.startX + (shape.x - shape.startX) * 0.5;
  const centerY = shape.startY + (shape.y - shape.startY) * 0.5;

  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    radiusX || 1,
    radiusY || 1,
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
}
