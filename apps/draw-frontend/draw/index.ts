import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { drawShape } from "./shapes/drawShapes";
import { Shape } from "./shapes/Types";
import { getShapeData } from "./shapeData";

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

  const handleDown = (e: PointerEvent) => {
    isMouseDown.current = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const handleMove = (e: PointerEvent) => {
    if (isMouseDown.current && shapeType) {
      const x = e.clientX;
      const y = e.clientY;

      clearCanvas(canvas, ctx, existingShapes); // Clear canvas and redraw existing shapes

      const shape = getShapeData(shapeType, startX, startY, x, y);
      drawShape(ctx, shape as Shape);

      //ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      //ctx.strokeRect(startX, startY, width, height);
    }
  };

  const handleUp = (e: PointerEvent) => {
    isMouseDown.current = false;

    // Return early if no shape type is selected
    if (!shapeType) return;

    const shape = getShapeData(
      shapeType,
      startX,
      startY,
      e.clientX,
      e.clientY,
    ) as Shape;

    existingShapes.push(shape);

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

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);

  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}
