import useAppSelector from "@/hooks/useAppSelector";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
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
import { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";

function MoreOptionsButton() {
  const theme = useTheme();
  const categoriesTree = useAppSelector(categorySelectors.tree);
  const anchorEl = useRef<HTMLButtonElement>({} as HTMLButtonElement);
  const [open, setOpen] = useState(false);
  const id = open ? "more-options-popper" : undefined;

  useGetCategoryTreesQuery();

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
                {categoriesTree.map((category, index) => (
                  <Fragment key={category.id}>
                    <List
                      aria-labelledby={`more-opt-${category.id}`}
                      dense
                      subheader={
                        <ListSubheader
                          id={`more-opt-${category.id}`}
                          disableSticky
                          component={Link}
                          to={`/products?category=${category.id}`}
                          sx={{
                            textDecoration: "none",
                          }}
                          onClick={() => setOpen(false)}>
                          {category.name}
                        </ListSubheader>
                      }>
                      {category.children.map((child) => (
                        <ListItemButton
                          key={child.id}
                          component={Link}
                          to={`/products?category=${child.id}`}
                          onClick={() => setOpen(false)}>
                          <ListItemText primary={child.name} />
                        </ListItemButton>
                      ))}
                    </List>
                    {index < categoriesTree.length - 1 && <Divider orientation="vertical" flexItem />}
                  </Fragment>
                ))}
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}

export default MoreOptionsButton;
