export type Shape =
  | {
      type: "rect";
      startX: number;
      startY: number;
      width: number;
      height: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      x: number;
      y: number;
      thickness: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    };
