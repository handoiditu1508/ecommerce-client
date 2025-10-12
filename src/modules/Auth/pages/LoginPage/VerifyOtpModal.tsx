import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type OtpInput = {
  otp: string;
  trusted: boolean;
};

type VerifyOtpModalProps = {
  onLoginSuccess?: () => void;
  onReturnToLogin?: MouseEventHandler<HTMLAnchorElement>;
};

function VerifyOtpModal({ onLoginSuccess = CONFIG.EMPTY_FUNCTION, onReturnToLogin = CONFIG.EMPTY_FUNCTION }: VerifyOtpModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm<OtpInput>({
    defaultValues: {
      otp: "",
      trusted: false,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<OtpInput> = (data) => {
    console.log(data);
    onLoginSuccess();
  };

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
      <LockIcon sx={{
        fontSize: 100,
        mx: "auto",
      }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Two-Factor Authentication</Typography>
      <Typography variant="h6" align="center" sx={{ mt: 0.5 }}>Check you inbox at e****le@gmail.com for your 2FA code</Typography>
      <Box component="form" sx={{ mt: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="otp"
          rules={{
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              placeholder="Enter OTP"
              slotProps={{
                htmlInput: {
                  readOnly: loading,
                  sx: {
                    textAlign: "center",
                  },
                },
              }}
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              {...field}
            />
          )}
        />
        <Button fullWidth size="large" loading={loading} sx={{ mt: 2 }} type="submit">SIGN IN</Button>
        <Box sx={{
          display: "flex",
          alignItems: "center",
        }}>
          <Controller
            control={control}
            name="trusted"
            render={({ field }) => (
              <FormControlLabel control={<Checkbox disabled={loading} />} label="Trusted device" {...field} />
            )}
          />
          <Typography sx={{ flex: 1 }} align="right">Didn't receive OTP?</Typography>
          <Button variant="text" disabled={loading} sx={{ textTransform: "initial", ...theme.typography.body1 }}>Resend OTP</Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }} />
      <CustomLink to="/login" align="center" onClick={onReturnToLogin}>Return to login</CustomLink>
    </Box>
  );
}

export default VerifyOtpModal;
