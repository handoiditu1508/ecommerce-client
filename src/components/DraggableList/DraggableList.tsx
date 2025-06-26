import CONFIG from "@/configs";
import { useDragListItem } from "@/hooks";
import { Collapse, List, ListProps, styled } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import DraggableListItem from "./DraggableListItem";

type OwnProps<T = any> = {
  selectedIndex?: number;
  items: T[];
  selectItemId: (item: T) => React.Key;
  selectItemContent: (item: T) => string | number | undefined;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onRemoveItem?: (index: number) => void;
  onSelectItem?: (index: number) => void;
};

export type DraggableListProps<T = any> = OwnProps<T> & Omit<ListProps, keyof OwnProps>;

const DraggableList = styled(({ selectedIndex, items, selectItemId, selectItemContent, onMoveItem, onRemoveItem = CONFIG.EMPTY_FUNCTION, onSelectItem = CONFIG.EMPTY_FUNCTION,
  ...props }: DraggableListProps) => {
  const [
    draggingIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  ] = useDragListItem(onMoveItem);

  return (
    <List disablePadding {...props}>
      <TransitionGroup>
        {items.map((item, index) => <Collapse key={selectItemId(item)}>
          <DraggableListItem
            dragging={index === draggingIndex}
            selected={index === selectedIndex}
            disableHoverEffect={draggingIndex !== undefined}
            text={selectItemContent(item)}
            onRemove={() => onRemoveItem(index)}
            onClick={() => onSelectItem(index)}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragEnd={handleDragEnd}
          />
        </Collapse>)}
      </TransitionGroup>
    </List>
  );
})(({ theme }) => ({
  overflowY: "auto",
  ...theme.mixins.scrollbar,
}));

export default DraggableList;
