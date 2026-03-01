


export const handleDown = ({
  isMouseDown,
e 
}: {isMouseDown: boolean, e : PointerEvent} ) => {
    isMouseDown.current = true;
    startX = e.clientX;
    startY = e.clientY;
  };
}