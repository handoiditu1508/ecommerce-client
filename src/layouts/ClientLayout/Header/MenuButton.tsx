import CustomLink from "@/components/CustomLink";
import LetterAvatar from "@/components/LetterAvatar";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { BreakpointsContext, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import UKRoundedFlagIcon from "@/icons/UKRoundedFlagIcon";
import VNRoundedFlagIcon from "@/icons/VNRoundedFlagIcon";
import { authSelectors, clearAuthState } from "@/redux/slices/authSlice";
import { mdiSale } from "@mdi/js";
import CategoryIcon from "@mui/icons-material/Category";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Face2Icon from "@mui/icons-material/Face2";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useColorScheme, useTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NotificationButton from "./NotificationButton";

function MenuButton() {
  const theme = useTheme();
  const authUser = useAppSelector(authSelectors.user);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { xsAndDown } = useContext(BreakpointsContext);
  const { mode, setMode } = useColorScheme();
  const dispatch = useAppDispatch();
  const { t: tMain } = useTranslation("main");

  const logout: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    dispatch(clearAuthState());
  };

  return (
    <>
      <IconButton
        edge="start"
        aria-label="menu"
        sx={{
          color: "inherit",
        }}
        onClick={() => setOpen(true)}>
        <Badge
          badgeContent={4}
          color="error"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}>
          <MenuIcon />
        </Badge>
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          display: "flex",
          height: 120,
          borderBottom: theme.shape.smallBorder,
          alignItems: "center",
          px: 1,
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            flexDirection: "column",
            height: "initial",
            pt: 6,
            pb: 2,
          },
        }}>
          {xsAndDown && <IconButton
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onClick={() => setOpen(false)}>
            <MenuOpenIcon />
          </IconButton>}
          <NotificationButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
          <LetterAvatar
            alt="avatar"
            sx={{
              color: "inherit",
              width: 80,
              height: 80,
              fontSize: 60,
              [xsAndDownMediaQuery(theme.breakpoints)]: {
                width: 120,
                height: 120,
                fontSize: 90,
              },
            }}>
            {authUser
              ? `${authUser.firstName} ${authUser.lastName}`
              : <Face2Icon fontSize="inherit" />}
          </LetterAvatar>
          <Stack sx={{
            height: 80,
            ml: 1,
            [xsAndDownMediaQuery(theme.breakpoints)]: {
              alignItems: "center",
            },
          }}>
            {authUser
              ? <>
                <Typography variant="h6">{authUser.firstName} {authUser.lastName}</Typography>
                <Box flexGrow={1} />
                <CustomLink to="/account" typography="caption">{tMain("setting")}</CustomLink>
                <CustomLink to="/" typography="caption" onClick={logout}>{tMain("sign_out")}</CustomLink>
              </>
              : <>
                <Box flexGrow={1} />
                <CustomLink to="/login" typography="caption">{tMain("login")}</CustomLink>
                <CustomLink to="/register" typography="caption" onClick={logout}>{tMain("register")}</CustomLink>
                <Box flexGrow={1} />
              </>}
          </Stack>
        </Box>
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/products/latest">
              <ListItemIcon>
                <NewReleasesIcon />
              </ListItemIcon>
              <ListItemText primary={tMain("new_collection")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary={tMain("popular")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <ThumbUpIcon />
              </ListItemIcon>
              <ListItemText primary={tMain("best_rated")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/products/discount">
              <ListItemIcon>
                <MdiSvgIcon path={mdiSale} />
              </ListItemIcon>
              <ListItemText primary={tMain("discount")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/products">
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={tMain("all_categories")} />
            </ListItemButton>
          </ListItem>
        </List>
        <ToggleButtonGroup value={mode} color="primary" fullWidth aria-label="toggle button group">
          <ToggleButton value="light" sx={{ borderRadius: 0, borderLeft: "none" }} onClick={() => setMode("light")}><LightModeIcon /></ToggleButton>
          <ToggleButton value="system" onClick={() => setMode("system")}><SettingsBrightnessIcon /></ToggleButton>
          <ToggleButton value="dark" sx={{ borderRadius: 0, borderRight: "none" }} onClick={() => setMode("dark")}><DarkModeIcon /></ToggleButton>
        </ToggleButtonGroup>
        <List>
          <ListItem>
            <ListItemButton onClick={() => setLanguageOpen(!languageOpen)}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary={tMain("language")} />
              <ExpandMoreIcon
                style={{
                  ...(languageOpen && {
                    transform: "rotateZ(180deg)",
                  }),
                }}
                sx={{
                  transition: theme.transitions.create("transform"),
                }}
              />
            </ListItemButton>
          </ListItem>
          <Collapse in={languageOpen} timeout={theme.transitions.duration.standard}>
            <List>
              <ListItem>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <VNRoundedFlagIcon />
                  </ListItemIcon>
                  <ListItemText primary={tMain("vietnamese")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <UKRoundedFlagIcon />
                  </ListItemIcon>
                  <ListItemText primary={tMain("english")} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}

export default MenuButton;
