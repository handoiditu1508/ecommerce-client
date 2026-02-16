import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MouseEventHandler } from "react";

type VerifyEmailModalProps = {
  onChangeEmail?: MouseEventHandler<HTMLAnchorElement>;
};

function VerifyEmailModal({ onChangeEmail = CONFIG.EMPTY_FUNCTION }: VerifyEmailModalProps) {
  const theme = useTheme();

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
      <Typography variant="h4" align="center">Verify Email</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>A confirmation email has been sent to your email address at e****le@gmail.com</Typography>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}>
        <Typography>Didn't receive email?</Typography>
        <Button variant="text" sx={{ textTransform: "initial", ...theme.typography.body1 }}>Resend email</Button>
      </Box>
      <Box sx={{ flex: 1 }} />
      <CustomLink to="" align="center" onClick={onChangeEmail}>Use different email</CustomLink>
    </Box>
  );
}

export default VerifyEmailModal;
