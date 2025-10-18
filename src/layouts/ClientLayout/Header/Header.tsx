import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { mdiSale } from "@mdi/js";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useContext } from "react";
import { Link } from "react-router-dom";
import LayoutContainer from "../LayoutContainer";
import LanguageSelect from "./LanguageSelect";
import MenuButton from "./MenuButton";
import MoreOptionsButton from "./MoreOptionsButton";
import PaletteModeSelect from "./PaletteModeSelect";

function Header() {
  const theme = useTheme();
  const shadowHeaderTrigger = useScrollTrigger({ threshold: 0, disableHysteresis: true });
  const { smAndUp, mdAndUp } = useContext(BreakpointsContext);

  return (
    <AppBar
      elevation={shadowHeaderTrigger ? 4 : 0}
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
    >
      {mdAndUp && <Toolbar
        sx={{
          minHeight: "var(--top-header-height) !important",
          backgroundColor: "primary.dark",
        }}
      >
        <LayoutContainer
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1.5,
          }}>
          <PaletteModeSelect />
          <LanguageSelect />
        </LayoutContainer>
      </Toolbar>}
      <Toolbar>
        <LayoutContainer
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          {!mdAndUp && <MenuButton />}
          {smAndUp && <CustomLink
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
            }}>
            <img src={logo} alt="logo" width={30} height={30} style={{ marginRight: theme.spacing(1) }} />
            <Typography variant="h5">Logo</Typography>
          </CustomLink>}
          <InputBase
            fullWidth
            placeholder="Search..."
            size="small"
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              color: "inherit",
              backgroundColor: theme.alpha(theme.palette.common.white, 0.15),
              "&:hover": {
                backgroundColor: theme.alpha(theme.palette.common.white, 0.25),
              },
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  color: "inherit",
                }}>
                <IconButton
                  aria-label="search"
                  edge="end"
                  sx={{
                    color: "inherit",
                  }}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <Stack direction="row">
            {mdAndUp && <>
              <IconButton sx={{ color: "inherit" }}>
                <PersonIcon />
              </IconButton>
              <IconButton sx={{ color: "inherit" }}>
                <Badge
                  badgeContent={4}
                  color="error"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </>}
            {smAndUp && <IconButton component={Link} to="/" edge="end" sx={{ color: "inherit" }}>
              <ShoppingCartIcon />
            </IconButton>}
          </Stack>
        </LayoutContainer>
      </Toolbar>
      {mdAndUp && <Toolbar sx={{ minHeight: "var(--bottom-header-height) !important" }}>
        <LayoutContainer
          sx={{
            display: "flex",
            alignItems: "center",
          }}>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
            ml: -1.5,
          }}>
            <NewReleasesIcon />
            <Typography variant="h6">New Collection</Typography>
          </ButtonBase>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
          }}>
            <TrendingUpIcon />
            <Typography variant="h6">Popular</Typography>
          </ButtonBase>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
          }}>
            <ThumbUpIcon />
            <Typography variant="h6">Best Rated</Typography>
          </ButtonBase>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
          }}>
            <MdiSvgIcon path={mdiSale} />
            <Typography variant="h6">Sale Off</Typography>
          </ButtonBase>
          <MoreOptionsButton />
        </LayoutContainer>
      </Toolbar>}
    </AppBar>
  );
}

export default Header;
