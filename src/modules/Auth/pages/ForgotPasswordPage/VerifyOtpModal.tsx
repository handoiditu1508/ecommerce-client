import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type OtpInput = {
  otp: string;
};

type VerifyOtpModalProps = {
  onSuccess?: () => void;
  onChangeEmail?: MouseEventHandler<HTMLAnchorElement>;
};

function VerifyOtpModal({ onSuccess = CONFIG.EMPTY_FUNCTION, onChangeEmail = CONFIG.EMPTY_FUNCTION }: VerifyOtpModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm<OtpInput>({
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<OtpInput> = (data) => {
    console.log(data);
    onSuccess();
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
      <Typography variant="h4" align="center">Create Account</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>An OTP has been sent to your email at e****le@gmail.com</Typography>
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
        <Button fullWidth size="large" loading={loading} sx={{ mt: 2 }} type="submit">Verify</Button>
        <Box sx={{
          display: "flex",
          alignItems: "center",
        }}>
          <Typography sx={{ flex: 1 }} align="right">Didn't receive OTP?</Typography>
          <Button variant="text" disabled={loading} sx={{ textTransform: "initial", ...theme.typography.body1 }}>Resend OTP</Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }} />
      <CustomLink to="" align="center" onClick={onChangeEmail}>Use different email</CustomLink>
    </Box>
  );
}

export default VerifyOtpModal;
