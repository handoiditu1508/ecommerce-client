import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { PreConfirmEmailCommand } from "@/models/apis/preConfirmEmail";
import { usePreConfirmEmailMutation } from "@/redux/apis/authApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RegisterReducerAction, RegisterReducerState } from "./useRegisterReducer";

type RegisterEmailModalProps = {
  registerState: RegisterReducerState;
  registerDispatch: ActionDispatch<[RegisterReducerAction]>;
  onSuccess?: () => void;
};

function RegisterEmailModal({
  registerState,
  registerDispatch,
  onSuccess = CONFIG.EMPTY_FUNCTION,
}: RegisterEmailModalProps) {
  const theme = useTheme();
  const { t: tError } = useTranslation("errors");
  const [preconfirmEmail, result] = usePreConfirmEmailMutation();
  const { handleSubmit, control, setError } = useForm<PreConfirmEmailCommand>({
    defaultValues: {
      email: registerState.email,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<PreConfirmEmailCommand> = async (data) => {
    const response = await preconfirmEmail(data);
    if (response.data) {
      registerDispatch({ type: "SET_EMAIL", payload: data.email });
      onSuccess();
    } else {
      console.error(response.error);
      if (response.error.code) {
        setError(
          "email",
          { message: tError(response.error.code) },
          { shouldFocus: true }
        );
      }
    }
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
                  readOnly: result.isLoading,
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
        <Button fullWidth size="large" loading={result.isLoading} sx={{ mt: 2 }} type="submit">SIGN UP</Button>
      </Box>
      <Divider sx={{ my: 2 }}>Or sign in with</Divider>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}>
        <Button fullWidth variant="outlined" disabled={result.isLoading}>Google</Button>
        <Button fullWidth variant="outlined" disabled={result.isLoading}>Facebook</Button>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Typography align="center">Already have an account? <CustomLink to="/login-in">Sign in</CustomLink></Typography>
    </Box>
  );
}

export default RegisterEmailModal;
