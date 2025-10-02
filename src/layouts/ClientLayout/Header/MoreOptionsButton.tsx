import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ButtonBase from "@mui/material/ButtonBase";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function MoreOptionsButton() {
  // const [moreOptionsAnchorEl, setMoreOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const anchorEl = useRef<HTMLButtonElement>({} as HTMLButtonElement);
  const [open, setOpen] = useState(false);
  const id = open ? "more-options-popper" : undefined;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ButtonBase
        ref={anchorEl}
        aria-describedby={id}
        sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          height: "100%",
          px: 1.5,
        }}
        onClick={handleClick}>
        <MoreHorizIcon />
      </ButtonBase>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl.current}
        transition
        sx={{
          zIndex: theme.zIndex.appBar + 1,
        }}>
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Fade {...TransitionProps}>
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                }}>
                <List
                  aria-labelledby="more-opt-1"
                  dense
                  subheader={<ListSubheader id="more-opt-1" disableSticky>Subheader 1</ListSubheader>}>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 1" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 2" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 3" />
                  </ListItemButton>
                </List>
                <Divider orientation="vertical" flexItem />
                <List
                  aria-labelledby="more-opt-2"
                  dense
                  subheader={<ListSubheader id="more-opt-2" disableSticky>Subheader 2</ListSubheader>}>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 1" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 2" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 3" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 4" />
                  </ListItemButton>
                </List>
                <Divider orientation="vertical" flexItem />
                <List
                  aria-labelledby="more-opt-3"
                  dense
                  subheader={<ListSubheader id="more-opt-3" disableSticky>Subheader 3</ListSubheader>}>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 1" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Option 2" />
                  </ListItemButton>
                </List>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}

export default MoreOptionsButton;
