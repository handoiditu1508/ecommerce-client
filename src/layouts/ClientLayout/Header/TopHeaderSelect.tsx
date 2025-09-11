import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ButtonBase from "@mui/material/ButtonBase";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { svgIconClasses } from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import React, { ReactElement, useId, useState } from "react";

export type TopHeaderSelectItem = {
  title: string;
  value: React.Key;
  icon: ReactElement;
};

export type TopHeaderSelectProps = {
  items: TopHeaderSelectItem[];
  selectedItem?: TopHeaderSelectItem;
  onSelect?: React.Dispatch<TopHeaderSelectItem>;
};

function TopHeaderSelect({ items, selectedItem, onSelect }: TopHeaderSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const menuAnchorId = useId();
  const menuId = useId();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (item: TopHeaderSelectItem) => {
    onSelect && onSelect(item);
    handleClose();
  };

  return (
    <>
      <ButtonBase
        id={menuAnchorId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          [`.${svgIconClasses.root}`]: {
            fontSize: 16,
          },
        }}
        onClick={handleClick}
      >
        {
          selectedItem && <>
            {selectedItem.icon}
            {selectedItem.title && <Typography
              variant="caption"
              sx={{ ml: 1 }}>
              {selectedItem.title}
            </Typography>}
          </>
        }
        <ArrowDropDownIcon sx={{
          fontSize: 16,
          ml: 0.5,
        }}
        />
      </ButtonBase>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        slotProps={{
          list: {
            "aria-labelledby": menuAnchorId,
            dense: true,
          },
        }}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.value} selected={selectedItem === item} onClick={() => handleSelect(item)}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default TopHeaderSelect;
