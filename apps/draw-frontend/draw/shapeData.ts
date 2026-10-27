import { Points, Shape } from "./shapes/Types";

type ShapeType = Shape["type"] | "";

/** Builds the shape data object from raw pointer coordinates. */
export function getShapeData(
  type: ShapeType,
  startX: number,
  startY: number,
  x: number,
  y: number,
  strokes?: Points[],
): Shape | null {
  switch (type) {
    case "rect":
      return { type, startX, startY, width: x - startX, height: y - startY };

    case "line":
      return { type, startX, startY, x, y, thickness: 1 };

    case "circle":
      return {
        type,
        startX,
        startY,
        x,
        y,
        radius:
          Math.sqrt(
            (x - startX) * (x - startX) + (y - startY) * (y - startY),
          ) / 2,
      };

    case "pencil":
      return { type, stroke: strokes ?? [], thickness: 1 };

    case "eraser":
      return { type, stroke: strokes ?? [], size: 20 };

    default:
      return null;
  }
}
