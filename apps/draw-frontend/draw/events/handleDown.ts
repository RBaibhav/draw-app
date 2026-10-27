import { MutableRefObject } from "react";

export const handleDown = ({
  isMouseDown,
  e,
}: {
  isMouseDown: MutableRefObject<boolean>;
  e: PointerEvent;
}) => {
  isMouseDown.current = true;
};