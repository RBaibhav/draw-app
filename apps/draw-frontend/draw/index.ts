import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { drawShape } from "./shapes/drawShapes";
import { Shape } from "./shapes/Types";

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
    if (isMouseDown.current) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(canvas, ctx, existingShapes); // Clear canvas and redraw existing shapes

      //      const shape: Shape = getShapeData(shapeType, e, startX, startY);
      switch (shapeType) {
        case "line": {
          drawShape(ctx, {
            type: "line",
            startX,
            startY,
            thickness: 1,
            x: e.clientX,
            y: e.clientY,
          });
          break;
        }
        case "rect": {
          console.log("hehe");

          drawShape(ctx, {
            type: "rect",
            startX,
            startY,
            width: width,
            height: height,
          });
        }
      }

      //ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      //ctx.strokeRect(startX, startY, width, height);
    }
  };

  const handleUp = (e: PointerEvent) => {
    isMouseDown.current = false;

    const width = e.clientX - startX;
    const height = e.clientY - startY;
    /*
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
   */

    let shape: Shape;
    switch (shapeType) {
      case "line": {
        shape = {
          type: "line",
          startX,
          startY,
          thickness: 1,
          x: e.clientX,
          y: e.clientY,
        };
        break;
      }
      case "rect": {
        console.log("hehe");

        shape = {
          type: "rect",
          startX,
          startY,
          width: width,
          height: height,
        };
        break;
      }
      default:
        throw new Error("Invalid shape type");
    }
    
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
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }
    if (shape.type === "line") {
      drawShape(ctx, shape);
    }
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
