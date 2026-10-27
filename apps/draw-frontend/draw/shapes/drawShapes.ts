import { drawCircle } from "./circle";
import { drawEraser } from "./eraser";
import { drawLine } from "./line";
import { drawPencil } from "./pencil";
import { drawRect } from "./rect";
import { Shape } from "./Types";

/** Renders a single shape onto the canvas, fully isolated via save/restore. */
export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (shape.type) {
    case "circle":
      drawCircle(ctx, shape);
      break;
    case "line":
      drawLine(ctx, shape);
      break;
    case "rect":
      drawRect(ctx, shape);
      break;
    case "pencil":
      drawPencil(ctx, shape);
      break;
    case "eraser":
      drawEraser(ctx, shape);
      break;
  }

  ctx.restore();
}