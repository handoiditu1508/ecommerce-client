import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import CopyrightIcon from "@mui/icons-material/Copyright";
import EmailIcon from "@mui/icons-material/Email";
import { Box, BoxProps, Breadcrumbs, Divider, Grid2, Link, Paper, Stack, Typography, styled } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const navigatesList: { text: string; link: string; }[] = [
  {
    text: "Nature",
    link: "/nature",
  },
  {
    text: "Wild",
    link: "/wild",
  },
  {
    text: "Fire",
    link: "/fire",
  },
  {
    text: "Water",
    link: "/water",
  },
  {
    text: "Ice",
    link: "/ice",
  },
  {
    text: "Electricity",
    link: "/electricity",
  },
  {
    text: "Air",
    link: "/air",
  },
  {
    text: "Earth",
    link: "/earth",
  },
  {
    text: "Light",
    link: "/light",
  },
  {
    text: "Shadow",
    link: "/shadow",
  },
  {
    text: "Magic",
    link: "/magic",
  },
  {
    text: "Necromancy",
    link: "/magic/necromancy",
  },
  {
    text: "Physical",
    link: "/physical",
  },
  {
    text: "Knight",
    link: "/physics/knight",
  },
];

const handleClickLink = () => {
  window.scrollTo({ top: 0 });
};

const Footer = styled(({ component = "footer", ...props }: BoxProps) => {
  const { t } = useTranslation();
  const { xs, smAndUp, lgAndUp } = useContext(BreakpointsContext);
  const year = new Date().getFullYear();

  return (
    <Box component={component} {...props}>
      <Paper square>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, lg: 4 }}>
            <Stack direction="row">
              <Box>
                <img src={logo} alt="logo" width={100} height={100} />
              </Box>
              <Box>
                <Typography className="title" variant="h5">{t("About Us")}</Typography>
                <Typography variant="body1">
                  {t("aboutUsLine1", { appName: CONFIG.APP_NAME })}<br />
                  {t("aboutUsLine2")}<br />
                  {t("aboutUsLine3")}
                </Typography>
              </Box>
            </Stack>
          </Grid2>
          <Grid2 container size={{ xs: 12, lg: 8 }}>
            <Grid2 size={{ xs: 12, lg: 6 }}>
              <Typography className="title" variant="h5" textAlign={{ xs: "center", lg: "start" }}>{t("Navigates")}</Typography>
            </Grid2>
            {lgAndUp && <Grid2 size={6} />}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Stack alignItems={{ xs: "center", lg: "flex-start" }}>
                {navigatesList.slice(0, smAndUp ? (Math.ceil(navigatesList.length / 2)) : undefined).map((nav) => <CustomLink key={nav.text} to={nav.link} underline="hover" variant="body1" onClick={handleClickLink}>{t(nav.text)}</CustomLink>)}
              </Stack>
            </Grid2>
            {smAndUp && <Grid2 size={6}>
              <Stack alignItems={{ xs: "center", lg: "flex-start" }}>
                {navigatesList.slice(Math.ceil(navigatesList.length / 2)).map((nav) => <CustomLink key={nav.text} to={nav.link} underline="hover" variant="body1" onClick={handleClickLink}>{t(nav.text)}</CustomLink>)}
              </Stack>
            </Grid2>}
          </Grid2>
        </Grid2>
        <Divider />
        <Box className="legal-section" component="section">
          <Box flexGrow={1} />
          {smAndUp && <Breadcrumbs separator="•" aria-label="footer-breadcrumbs">
            <Typography className="copyright-text" variant="subtitle2">
              <CopyrightIcon />
              Copyright {year}, {window.location.host}
            </Typography>
            <CustomLink to="/privacy-policy" underline="hover" variant="subtitle2">{t("Privacy Policy")}</CustomLink>
          </Breadcrumbs>}
          {xs && <Stack alignItems="center">
            <Typography className="copyright-text" variant="subtitle2" textAlign="center">
              <CopyrightIcon />
              Copyright {year}, {window.location.host}
            </Typography>
            <CustomLink to="/privacy-policy" underline="hover" variant="subtitle2">{t("Privacy Policy")}</CustomLink>
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
  color: theme.palette.text.secondary,
  ">.MuiPaper-root": {
    boxShadow: "none",
    padding: theme.spacing(CONFIG.LAYOUT_PADDING),
    paddingTop: theme.spacing(2),
  },
  ".MuiDivider-root": {
    margin: theme.spacing(2, -CONFIG.LAYOUT_PADDING, 1),
  },
  ".MuiTypography-root": {
    color: theme.palette.text.secondary,
    "&.title": {
      color: theme.palette.text.primary,
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
