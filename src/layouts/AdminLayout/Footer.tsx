import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import CopyrightIcon from "@mui/icons-material/Copyright";
import EmailIcon from "@mui/icons-material/Email";
import Box, { BoxProps } from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const navigatesList: { text: string; link: string; }[] = [
  {
    text: "nature",
    link: "/nature",
  },
  {
    text: "wild",
    link: "/wild",
  },
  {
    text: "fire",
    link: "/fire",
  },
  {
    text: "water",
    link: "/water",
  },
  {
    text: "ice",
    link: "/ice",
  },
  {
    text: "electricity",
    link: "/electricity",
  },
  {
    text: "air",
    link: "/air",
  },
  {
    text: "earth",
    link: "/earth",
  },
  {
    text: "light",
    link: "/light",
  },
  {
    text: "shadow",
    link: "/shadow",
  },
  {
    text: "magic",
    link: "/magic",
  },
  {
    text: "necromancy",
    link: "/magic/necromancy",
  },
  {
    text: "physical",
    link: "/physical",
  },
  {
    text: "knight",
    link: "/physics/knight",
  },
];

const handleClickLink = () => {
  window.scrollTo({ top: 0 });
};

const Footer = styled(({ component = "footer", ...props }: BoxProps) => {
  const { t } = useTranslation();
  const { xsAndDown, smAndUp, lgAndUp } = useContext(BreakpointsContext);
  const year = new Date().getFullYear();

  return (
    <Box component={component} {...props}>
      <Paper square>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack direction="row">
              <Box>
                <img src={logo} alt="logo" width={100} height={100} />
              </Box>
              <Box>
                <Typography className="title" variant="h5">{t("about_us")}</Typography>
                <Typography variant="body1">
                  {t("about_us_line_1", { appName: CONFIG.APP_NAME })}<br />
                  {t("about_us_line_2")}<br />
                  {t("about_us_line_3")}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid container size={{ xs: 12, lg: 8 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography className="title" variant="h5" textAlign={{ xs: "center", lg: "start" }}>{t("navigates")}</Typography>
            </Grid>
            {lgAndUp && <Grid size={6} />}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack alignItems={{ xs: "center", lg: "flex-start" }}>
                {navigatesList.slice(0, smAndUp ? (Math.ceil(navigatesList.length / 2)) : undefined).map((nav) => <CustomLink key={nav.text} to={nav.link} underline="hover" variant="body1" onClick={handleClickLink}>{t(nav.text)}</CustomLink>)}
              </Stack>
            </Grid>
            {smAndUp && <Grid size={6}>
              <Stack alignItems={{ xs: "center", lg: "flex-start" }}>
                {navigatesList.slice(Math.ceil(navigatesList.length / 2)).map((nav) => <CustomLink key={nav.text} to={nav.link} underline="hover" variant="body1" onClick={handleClickLink}>{t(nav.text)}</CustomLink>)}
              </Stack>
            </Grid>}
          </Grid>
        </Grid>
        <Divider />
        <Box className="legal-section" component="section">
          <Box flexGrow={1} />
          {smAndUp && <Breadcrumbs separator="•" aria-label="footer-breadcrumbs">
            <Typography className="copyright-text" variant="subtitle2">
              <CopyrightIcon />
              Copyright {year}, {window.location.host}
            </Typography>
            <CustomLink to="/privacy-policy" underline="hover" variant="subtitle2">{t("privacy_policy")}</CustomLink>
          </Breadcrumbs>}
          {xsAndDown && <Stack alignItems="center">
            <Typography className="copyright-text" variant="subtitle2" textAlign="center">
              <CopyrightIcon />
              Copyright {year}, {window.location.host}
            </Typography>
            <CustomLink to="/privacy-policy" underline="hover" variant="subtitle2">{t("privacy_policy")}</CustomLink>
          </Stack>}
          <Box flexGrow={1} />
          <Link href="mailto:handoiditu1508@gmail.com">
            <EmailIcon className="send-email-icon" fontSize="small" />
          </Link>
        </Box>
      </Paper>
    </Box>
  );
})(({ theme }) => ({
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  ">.MuiPaper-root": {
    boxShadow: "none",
    padding: theme.spacing(CONFIG.LAYOUT_PADDING),
    paddingTop: theme.spacing(2),
  },
  ".MuiDivider-root": {
    margin: theme.spacing(2, -CONFIG.LAYOUT_PADDING, 1),
  },
  ".MuiTypography-root": {
    color: theme.vars.palette.text.secondary,
    "&.title": {
      color: theme.vars.palette.text.primary,
    },
  },
  ".footer-content-section": {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  ".legal-section": {
    display: "flex",
    alignItems: "center",
  },
  ".copyright-text": {
    ".MuiSvgIcon-root": {
      marginRight: theme.spacing(0.5),
      fontSize: "inherit",
      verticalAlign: "middle",
    },
  },
  ul: {
    listStyleType: "none",
    padding: 0,
  },
}));

export default Footer;
