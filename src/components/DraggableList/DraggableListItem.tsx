import CloseIcon from "@mui/icons-material/Close";
import { IconButton, ListItem, ListItemButton, ListItemProps, ListItemText, styled } from "@mui/material";

type OwnProps = {
  dragging?: boolean;
  selected?: boolean;
  disableHoverEffect?: boolean;
  text?: string | number;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

type DraggableListItemProps = OwnProps & Omit<ListItemProps, keyof OwnProps>;

const DraggableListItem = styled(({ dragging, selected, disableHoverEffect, text, onRemove, onClick, ...props }: DraggableListItemProps) => {
  return (
    <ListItem
      draggable
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          disableRipple
          onClick={onRemove}>
          <CloseIcon />
        </IconButton>
      }
      {...props}>
      <ListItemButton
        selected={selected}
        onClick={onClick}>
        <ListItemText
          primary={text}
          slotProps={{
            primary: {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
})(({ theme, dragging, disableHoverEffect }) => ({
  borderBottom: theme.shape.smallBorder,
  opacity: dragging ? 0.5 : undefined,
  ".MuiListItemSecondaryAction-root": {
    ".MuiIconButton-root": {
      "&:hover": {
        color: theme.palette.error.main,
      },
    },
  },
  ".MuiListItemButton-root": {
    cursor: "move",
    "&:not(.Mui-selected):hover": {
      backgroundColor: disableHoverEffect ? "transparent" : undefined,
    },
  },
}));

export default DraggableListItem;
