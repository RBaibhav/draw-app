import { Shape } from "./Types";

/**
 * Draws the eraser cursor/preview on the canvas.
 * The actual erasing is done by removing shapes from the existingShapes array.
 */
export function drawEraser(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "eraser" }>,
) {
  if (!shape.stroke || shape.stroke.length === 0) return;

  // Draw a semi-transparent eraser path to show what will be erased
  const savedCompositeOp = ctx.globalCompositeOperation;
  const savedStrokeStyle = ctx.strokeStyle;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = shape.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  const [first, ...rest] = shape.stroke;
  ctx.moveTo(first.x, first.y);
  for (const pt of rest) {
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  ctx.globalCompositeOperation = savedCompositeOp;
  ctx.strokeStyle = savedStrokeStyle;
  ctx.lineWidth = 1;
}
