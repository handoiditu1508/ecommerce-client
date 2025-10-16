import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import LockResetIcon from "@mui/icons-material/LockReset";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type UsernameOrEmailInput = {
  email: string;
};

type UsernameOrEmailModalProps = {
  onSuccess?: () => void;
};

function UsernameOrEmailModal({ onSuccess = CONFIG.EMPTY_FUNCTION }: UsernameOrEmailModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm<UsernameOrEmailInput>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<UsernameOrEmailInput> = (data) => {
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
      <LockResetIcon
        sx={{
          fontSize: 100,
          mx: "auto",
        }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Forgot Password</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>We will send an OTP to your email</Typography>
      <Box component="form" sx={{ mt: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              placeholder="Username or email address"
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
        <Button fullWidth size="large" loading={loading} sx={{ mt: 2 }} type="submit">Send OTP</Button>
      </Box>
      <Box sx={{ flex: 1 }} />
      <CustomLink
        to="/login-in"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          mx: "auto",
        }}>
        <NavigateBeforeIcon fontSize="inherit" /> Return to login
      </CustomLink>
    </Box>
  );
}

export default UsernameOrEmailModal;
