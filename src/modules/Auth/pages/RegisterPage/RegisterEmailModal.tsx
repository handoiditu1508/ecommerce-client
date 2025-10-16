import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type RegisterEmailInput = {
  email: string;
};

type RegisterEmailModalProps = {
  onSuccess?: () => void;
};

function RegisterEmailModal({ onSuccess = CONFIG.EMPTY_FUNCTION }: RegisterEmailModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm<RegisterEmailInput>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<RegisterEmailInput> = (data) => {
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
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>We will send an OTP to your email</Typography>
      <Box component="form" sx={{ mt: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "This field is required",
            pattern: {
              ignoreCase: true,
              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email address",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              placeholder="Email address"
              slotProps={{
                htmlInput: {
                  readOnly: loading,
                  maxLength: CONFIG.EMAIL_MAX_LENGTH,
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
        <Button fullWidth size="large" loading={loading} sx={{ mt: 2 }} type="submit">SIGN UP</Button>
      </Box>
      <Divider sx={{ my: 2 }}>Or sign in with</Divider>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}>
        <Button fullWidth variant="outlined" disabled={loading}>Google</Button>
        <Button fullWidth variant="outlined" disabled={loading}>Facebook</Button>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Typography align="center">Already have an account? <CustomLink to="/login-in">Sign in</CustomLink></Typography>
    </Box>
  );
}

export default RegisterEmailModal;
