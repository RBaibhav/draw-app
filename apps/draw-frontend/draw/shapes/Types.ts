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
      startX: number;
      startY: number;
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "pencil";
      stroke: Points[];
      thickness: number;
    };

export interface Points{
  x: number;
  y: number;
}

