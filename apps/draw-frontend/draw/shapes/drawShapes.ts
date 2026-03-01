import { drawCircle } from "./circle";
import { drawLine } from "./line";
import { drawPencil } from "./pencil";
import { drawRect } from "./rect";
import { Shape } from "./Types";

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
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
  }
}