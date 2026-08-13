import CustomLink from "@/components/CustomLink";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

function SuccessModal() {
  const theme = useTheme();
  const { t } = useTranslation("auth");

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      py: 4,
      boxSizing: "border-box",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        px: 4,
      },
    }}>
      <CheckCircleIcon
        color="success"
        sx={{
          fontSize: 100,
          mx: "auto",
        }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{t("congratulation")}</Typography>
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{t("reset_password_success")}</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>
        {t("login_continue_prefix")} <CustomLink to="/login">{t("here")}</CustomLink> {t("login_continue_suffix")}
      </Typography>
    </Box>
  );
}

export default SuccessModal;
