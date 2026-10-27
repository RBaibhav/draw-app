import { Points } from "./shapes/Types";

export const getShapeData = (
  shapeType: string,
  startX: number,
  startY: number,
  x: number,
  y: number,
  strokes?: Points[],
) => {
  const width = x - startX;
  const height = y - startY;

  switch (shapeType) {
    case "line": {
      return {
        type: "line",
        startX,
        startY,
        x,
        y,
        thickness: 1,
      };
    }
    case "rect": {
      return {
        type: "rect",
        startX,
        startY,
        width,
        height,
      };
    }
    case "circle": {
      return {
        type: "circle",
        startX,
        startY,
        x,
        y,
        radius: Math.sqrt(width * width + height * height) / 2,
      };
    }
    case "pencil": {
      return {
        type: "pencil",
        stroke: strokes || [],
        thickness: 1,
      };
    }
    case "eraser": {
      return {
        type: "eraser",
        stroke: strokes || [],
        size: 20,
      };
    }
    default:
      throw new Error("Invalid shape type");
  }
};
