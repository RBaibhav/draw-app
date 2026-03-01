import { Shape } from "./Types";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "circle" }>,
) {
  const radiusX = (shape.x - shape.startX) * 0.5; /// radius for x based on input
  const  radiusY = (shape.y - shape.startY) * 0.5 /// radius for y based on input
  const  centerX = shape.startX + radiusX; /// calc center
  const  centerY = shape.startY + radiusY;
  const  step = 0.01; /// resolution of ellipse
  let  a = step; /// counter
  const  pi2 = Math.PI * 2 - step; /// end angle

  /// start a new path
  ctx.beginPath();

  /// set start point at angle 0
  ctx.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));

  /// create the ellipse
  for (; a < pi2; a += step) {
    ctx.lineTo(
      centerX + radiusX * Math.cos(a),
      centerY + radiusY * Math.sin(a),
    );
  }

  /// close it and stroke it for demo
  ctx.closePath();
  ctx.stroke();
}
