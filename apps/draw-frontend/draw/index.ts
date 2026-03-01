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

  console.log("shape : ", shapeType);

  if (!ctx) return;
  // Set canvas size to match display size
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(canvas, ctx, existingShapes); // Clear canvas and redraw existing shapes
    }
  };

  clearCanvas(canvas, ctx, existingShapes); // Clear canvas and redraw existing shapes

  let startX = 0;
  let startY = 0;

  const strokes: Points[] = []; // only for pencil tool

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
  };
  const handleMove = (e: PointerEvent) => {
    if (isMouseDown.current && shapeType) {
      const coords = getCanvasCoordinates(e);
      const x = coords.x;
      const y = coords.y;

      if (shapeType == "pencil") {
        strokes.push({ x, y });
      }

      clearCanvas(canvas, ctx, existingShapes); // Clear canvas and redraw existing shapes
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
      strokes,
    );
    existingShapes.push(shape as Shape);

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
  ctx.fillStyle = "rgba(0, 0, 0 )";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    drawShape(ctx, shape);
  });
}
