import CustomLink from "@/components/CustomLink";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { BreakpointsContext, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import UKRoundedFlagIcon from "@/icons/UKRoundedFlagIcon";
import VNRoundedFlagIcon from "@/icons/VNRoundedFlagIcon";
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
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
import { useContext, useState } from "react";

function MenuButton() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { xsAndDown } = useContext(BreakpointsContext);
  const { mode, setMode } = useColorScheme();

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
          <IconButton sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}>
            <Badge
              badgeContent={4}
              color="error"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar
            alt="avatar"
            sx={{
              color: "inherit",
              width: 80,
              height: 80,
              [xsAndDownMediaQuery(theme.breakpoints)]: {
                width: 120,
                height: 120,
              },
            }}>
            <Face2Icon sx={{
              fontSize: 60,
              [xsAndDownMediaQuery(theme.breakpoints)]: {
                fontSize: 90,
              },
            }}
            />
          </Avatar>
          <Stack sx={{
            height: 80,
            ml: 1,
            [xsAndDownMediaQuery(theme.breakpoints)]: {
              alignItems: "center",
            },
          }}>
            <Typography variant="h6">John Doe</Typography>
            <Box flexGrow={1} />
            <CustomLink to="/" typography="caption">Setting</CustomLink>
            <CustomLink to="/" typography="caption">Sign out</CustomLink>
          </Stack>
        </Box>
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <NewReleasesIcon />
              </ListItemIcon>
              <ListItemText primary="New Collection" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary="Popular" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <ThumbUpIcon />
              </ListItemIcon>
              <ListItemText primary="Best Rated" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <MdiSvgIcon path={mdiSale} />
              </ListItemIcon>
              <ListItemText primary="Sale Off" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="All Categories" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <ToggleButtonGroup value={mode} color="primary" fullWidth aria-label="toggle button group" sx={{ my: 1 }}>
          <ToggleButton value="light" onClick={() => setMode("light")}><LightModeIcon /></ToggleButton>
          <ToggleButton value="system" onClick={() => setMode("system")}><SettingsBrightnessIcon /></ToggleButton>
          <ToggleButton value="dark" onClick={() => setMode("dark")}><DarkModeIcon /></ToggleButton>
        </ToggleButtonGroup>
        <Divider />
        <List>
          <ListItem>
            <ListItemButton onClick={() => setLanguageOpen(!languageOpen)}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="Language" />
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
                  <ListItemText primary="Vietnamese" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <UKRoundedFlagIcon />
                  </ListItemIcon>
                  <ListItemText primary="English" />
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
