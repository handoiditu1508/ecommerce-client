import React, { useRef, useState } from "react";

const useDragListItem = (
  moveItem: (fromIndex: number, toIndex: number) => any
): [
    draggingIndex: number | undefined,
    handleDragStart: (index: number) => void,
    handleDragOver: (index: number) => React.DragEventHandler<HTMLElement>,
    handleDragEnd: () => void
  ] => {
  const [draggingIndex, setDraggingIndex] = useState<number | undefined>();
  const previousIndex = useRef<number | undefined>(-1);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (index: number): React.DragEventHandler<HTMLLIElement> => (event) => {
    if (previousIndex.current === draggingIndex// not trigger until state is updated
      || draggingIndex === undefined// not triger when item is not from the same list
      || index === draggingIndex// not trigger when position is unchanged
    ) {
      return;
    }

    // prevent default for onDrop to trigger
    event.preventDefault();

    const elementRect = event.currentTarget.getBoundingClientRect();
    const mouseOffset = event.clientY - elementRect.top - (elementRect.height / 2);
    if ((draggingIndex < index && mouseOffset < 0) || (draggingIndex > index && mouseOffset > 0)) {
      return;
    }

    moveItem(draggingIndex, index);
    setDraggingIndex(index);
    previousIndex.current = draggingIndex;
  };

  const handleDragEnd = () => {
    setDraggingIndex(undefined);
    previousIndex.current = -1;
  };

  return [
    draggingIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  ];
};

export default useDragListItem;
