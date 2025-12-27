import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";

function Footer() {
  const theme = useTheme();
  const ref = useRef<HTMLElement>({} as HTMLElement);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const footerHeight = entry.target.clientHeight;
        document.body.style.setProperty("--footer-height", `${footerHeight}px`);
      }
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      document.body.style.removeProperty("--footer-height");
    };
  }, []);

  return (
    <Paper
      ref={ref}
      square
      component="footer"
      sx={{
        mt: 10,
        py: 2,
        zIndex: theme.zIndex.drawer + 1,
        [smAndDownMediaQuery(theme.breakpoints)]: {
          px: 1,
        },
      }}
    >
      <Grid
        container
        columns={{ xs: 2, sm: 6, md: 5 }}>
        <Grid size={{ xs: 1, sm: 3, md: 1 }}>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}>
            <Box
              component="img"
              src={logo}
              alt="logo"
              width={100}
              height={100}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 1, sm: 3, md: 1 }}>
          <Stack sx={{ alignItems: "flex-start" }}>
            <Typography variant="subtitle1" fontWeight={700}>Account</Typography>
            <CustomLink to="/" underline="hover" variant="subtitle2">Setting</CustomLink>
            <CustomLink to="/" underline="hover" variant="subtitle2">Order History</CustomLink>
          </Stack>
        </Grid>
        <Grid size={{ xs: 1, sm: 2, md: 1 }}>
          <Stack sx={{ alignItems: "flex-start" }}>
            <Typography variant="subtitle1" fontWeight={700}>About {CONFIG.APP_NAME}</Typography>
            <CustomLink to="/" underline="hover" variant="subtitle2">About Us</CustomLink>
            <CustomLink to="/" underline="hover" variant="subtitle2">Terms & Conditions</CustomLink>
            <CustomLink to="/" underline="hover" variant="subtitle2">Privacy Policy</CustomLink>
          </Stack>
        </Grid>
        <Grid size={{ xs: 1, sm: 2, md: 1 }}>
          <Stack sx={{ alignItems: "flex-start" }}>
            <Typography variant="subtitle1" fontWeight={700}>Shop</Typography>
            <CustomLink to="/" underline="hover" variant="subtitle2">New Collections</CustomLink>
            <CustomLink to="/" underline="hover" variant="subtitle2">Popular Products</CustomLink>
            <CustomLink to="/" underline="hover" variant="subtitle2">Best Rate</CustomLink>
          </Stack>
        </Grid>
        <Grid size={{ xs: 2, sm: 2, md: 1 }}>
          <Stack sx={{ alignItems: "flex-start" }}>
            <Typography variant="subtitle1" fontWeight={700}>Support</Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: theme.typography.subtitle2.fontSize,
            }}>
              <EmailIcon fontSize="inherit" />
              <CustomLink to="/" underline="hover" variant="subtitle2">support@gmail.com</CustomLink>
            </Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: theme.typography.subtitle2.fontSize,
            }}>
              <PhoneIcon fontSize="inherit" />
              <CustomLink to="/" underline="hover" variant="subtitle2">000-000-0000</CustomLink>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Footer;
