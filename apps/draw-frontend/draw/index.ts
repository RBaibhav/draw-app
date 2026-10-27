import { getShapeData } from "./shapeData";
import { drawShape } from "./shapes/drawShapes";
import { Shape } from "./shapes/Types";
import { getExistingShapes } from "./http";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShapeTypeRef = { current: Shape["type"] | "" };
type MouseRef = { current: boolean };

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function fillCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function redrawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
  for (const shape of shapes) {
    drawShape(ctx, shape);
  }
}

function clearAndRedraw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fillCanvas(ctx, canvas);
  redrawShapes(ctx, shapes);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default async function initCanvas(
  canvas: HTMLCanvasElement,
  isMouseDown: MouseRef,
  roomId: string,
  socket: WebSocket,
  shapeTypeRef: ShapeTypeRef,
): Promise<(() => void) | undefined> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const shapes: Shape[] = await getExistingShapes(roomId);

  // ── Resize handling ──────────────────────────────────────────────────────

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    clearAndRedraw(canvas, ctx!, shapes);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ── WebSocket messages ───────────────────────────────────────────────────

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data as string);

      if (message.type === "draw_shape" && message.shape) {
        shapes.push(message.shape as Shape);
        clearAndRedraw(canvas, ctx, shapes);
        return;
      }

      if (message.type === "clear_canvas") {
        shapes.length = 0;
        clearAndRedraw(canvas, ctx, shapes);
      }
    } catch {
      // Ignore non-JSON handshake frames
    }
  };

  clearAndRedraw(canvas, ctx, shapes);

  // ── Pointer event state ──────────────────────────────────────────────────

  let startX = 0;
  let startY = 0;
  const liveStrokes: { x: number; y: number }[] = [];

  const isFreehand = () =>
    shapeTypeRef.current === "pencil" || shapeTypeRef.current === "eraser";

  function getCoords(e: PointerEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // ── Pointer handlers ─────────────────────────────────────────────────────

  function onPointerDown(e: PointerEvent) {
    isMouseDown.current = true;
    const { x, y } = getCoords(e);
    startX = x;
    startY = y;
    liveStrokes.length = 0;
    if (isFreehand()) liveStrokes.push({ x, y });
  }

  function onPointerMove(e: PointerEvent) {
    if (!isMouseDown.current || !shapeTypeRef.current) return;

    const { x, y } = getCoords(e);
    if (isFreehand()) liveStrokes.push({ x, y });

    clearAndRedraw(canvas, ctx, shapes);

    const preview = getShapeData(
      shapeTypeRef.current,
      startX,
      startY,
      x,
      y,
      isFreehand() ? liveStrokes : undefined,
    );
    if (preview) drawShape(ctx, preview);
  }

  function onPointerUp(e: PointerEvent) {
    isMouseDown.current = false;
    if (!shapeTypeRef.current) return;

    const { x, y } = getCoords(e);
    const shape = getShapeData(
      shapeTypeRef.current,
      startX,
      startY,
      x,
      y,
      isFreehand() ? [...liveStrokes] : undefined,
    );

    if (!shape) return;

    shapes.push(shape);
    clearAndRedraw(canvas, ctx, shapes);

    socket.send(JSON.stringify({ type: "draw_shape", roomId, shape }));
  }

  // ── Event listener registration ──────────────────────────────────────────

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
  };
}
