import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

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
  borderBottom: theme.vars.shape.smallBorder,
  opacity: dragging ? 0.5 : undefined,
  ".MuiListItemSecondaryAction-root": {
    ".MuiIconButton-root": {
      "&:hover": {
        color: theme.vars.palette.error.main,
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
