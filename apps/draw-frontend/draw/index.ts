import { drawShape } from "./shapes/drawShapes";
import { Points, Shape } from "./shapes/Types";
import { getShapeData } from "./shapeData";
import { getExistingShapes } from "./http";

export default async function initCanvas(
  canvas: HTMLCanvasElement,
  isMouseDown: { current: boolean },
  roomId: string,
  socket: WebSocket,
  shapeType: Shape["type"] | "",
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) return;

  // Set canvas size to match display size
  const resizeCanvas = () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    clearCanvas(canvas, ctx, existingShapes);
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      const shape = parsedShape.shape as Shape;

      if (shape.type === "eraser") {
        // For eraser shapes from WS, add to existingShapes so they persist
        existingShapes.push(shape);
      } else {
        existingShapes.push(shape);
      }
      clearCanvas(canvas, ctx, existingShapes);
    }
  };

  clearCanvas(canvas, ctx, existingShapes);

  let startX = 0;
  let startY = 0;

  const strokes: Points[] = []; // for pencil and eraser tools

  const getCanvasCoordinates = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleDown = (e: PointerEvent) => {
    isMouseDown.current = true;
    const coords = getCanvasCoordinates(e);
    startX = coords.x;
    startY = coords.y;
    strokes.length = 0; // Clear previous strokes
    if (shapeType === "pencil" || shapeType === "eraser") {
      strokes.push({ x: coords.x, y: coords.y });
    }
  };

  const handleMove = (e: PointerEvent) => {
    if (isMouseDown.current && shapeType) {
      const coords = getCanvasCoordinates(e);
      const x = coords.x;
      const y = coords.y;

      if (shapeType === "pencil" || shapeType === "eraser") {
        strokes.push({ x, y });
      }

      clearCanvas(canvas, ctx, existingShapes);
      const shape = getShapeData(shapeType, startX, startY, x, y, strokes);
      drawShape(ctx, shape as Shape);
    }
  };

  const handleUp = (e: PointerEvent) => {
    isMouseDown.current = false;

    // Return early if no shape type is selected
    if (!shapeType) return;

    const coords = getCanvasCoordinates(e);
    const shape = getShapeData(
      shapeType,
      startX,
      startY,
      coords.x,
      coords.y,
      shapeType === "pencil" || shapeType === "eraser" ? [...strokes] : undefined,
    );

    existingShapes.push(shape as Shape);
    clearCanvas(canvas, ctx, existingShapes);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      }),
    );
  };

  canvas.addEventListener("pointerdown", handleDown);
  canvas.addEventListener("pointerup", handleUp);
  canvas.addEventListener("pointermove", handleMove);

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("pointerdown", handleDown);
    canvas.removeEventListener("pointerup", handleUp);
    canvas.removeEventListener("pointermove", handleMove);
  };
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[],
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    drawShape(ctx, shape);
  });
}
