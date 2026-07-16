import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { mdiSale } from "@mdi/js";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AppBar from "@mui/material/AppBar";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LayoutContainer from "../LayoutContainer";
import CartButton from "./CartButton";
import LanguageSelect from "./LanguageSelect";
import MenuButton from "./MenuButton";
import MoreOptionsButton from "./MoreOptionsButton";
import NotificationButton from "./NotificationButton";
import PaletteModeSelect from "./PaletteModeSelect";
import Searchbar from "./Searchbar";
import UserMenuButton from "./UserMenuButton";

function Header() {
  const theme = useTheme();
  const shadowHeaderTrigger = useScrollTrigger({ threshold: 0, disableHysteresis: true });
  const { smAndUp, mdAndUp } = useContext(BreakpointsContext);
  const { t: tMain } = useTranslation("main");

  return (
    <AppBar
      elevation={shadowHeaderTrigger ? 4 : 0}
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
            <Typography variant="h5">{CONFIG.APP_NAME}</Typography>
          </CustomLink>}
          <Searchbar />
          <Stack direction="row">
            {mdAndUp && <>
              <UserMenuButton sx={{ color: "inherit" }} />
              <NotificationButton sx={{ color: "inherit" }} />
            </>}
            {smAndUp && <CartButton edge="end" sx={{ color: "inherit" }} />}
          </Stack>
        </LayoutContainer>
      </Toolbar>
      {mdAndUp && <Toolbar sx={{ minHeight: "var(--bottom-header-height) !important" }}>
        <LayoutContainer
          sx={{
            display: "flex",
            alignItems: "center",
          }}>
          <ButtonBase
            component={Link}
            to="/products/new"
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              height: "100%",
              px: 1.5,
              ml: -1.5,
            }}>
            <NewReleasesIcon />
            <Typography variant="h6">{tMain("new_collection")}</Typography>
          </ButtonBase>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
          }}>
            <TrendingUpIcon />
            <Typography variant="h6">{tMain("popular")}</Typography>
          </ButtonBase>
          <ButtonBase sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
            px: 1.5,
          }}>
            <ThumbUpIcon />
            <Typography variant="h6">{tMain("best_rated")}</Typography>
          </ButtonBase>
          <ButtonBase
            component={Link}
            to="/products/discount"
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              height: "100%",
              px: 1.5,
            }}>
            <MdiSvgIcon path={mdiSale} />
            <Typography variant="h6">{tMain("discount")}</Typography>
          </ButtonBase>
          <MoreOptionsButton />
        </LayoutContainer>
      </Toolbar>}
    </AppBar>
  );
}

export default Header;
