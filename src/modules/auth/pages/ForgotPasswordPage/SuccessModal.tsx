import CustomLink from "@/components/CustomLink";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function SuccessModal() {
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
      <CheckCircleIcon
        color="success"
        sx={{
          fontSize: 100,
          mx: "auto",
        }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Congratulation!</Typography>
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>You have successfully reset your password</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>Click <CustomLink to="/login">here</CustomLink> to continue your login</Typography>
    </Box>
  );
}

export default SuccessModal;
