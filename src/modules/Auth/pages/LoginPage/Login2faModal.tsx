import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { Login2faCommand } from "@/models/apis/login2fa";
import { useLogin2faMutation } from "@/redux/apis/authApi";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MouseEventHandler } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginReducerState } from "./useLoginReducer";

const formModel: DynamicFormModel<Login2faCommand> = {
  submitButtonText: "Sign in",
  inputs: [
    {
      name: "username",
      inputType: "hidden",
      required: true,
    },
    {
      name: "token",
      inputType: "text",
      rules: {
        required: "This field is required",
      },
      placeholder: "Enter OTP",
      textAlign: "center",
    },
  ],
  postActionInputs: [
    {
      name: "isPersistent",
      inputType: "checkbox",
      label: "Trusted device",
    },
  ],
};

type Login2faModalProps = {
  loginState: LoginReducerState;
  onSuccess?: () => void;
  onReturnToLogin?: MouseEventHandler<HTMLAnchorElement>;
};

function Login2faModal({
  loginState,
  onSuccess = CONFIG.EMPTY_FUNCTION,
  onReturnToLogin = CONFIG.EMPTY_FUNCTION,
}: Login2faModalProps) {
  const theme = useTheme();
  const [login2fa, result] = useLogin2faMutation();
  const formContext = useForm<Login2faCommand>({
    defaultValues: {
      username: loginState.username,
      token: "",
      isPersistent: false,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Login2faCommand> = async (data) => {
    const response = await login2fa(data);
    if (response.data) {
      onSuccess();
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
      <LockIcon sx={{
        fontSize: 100,
        mx: "auto",
      }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Two-Factor Authentication</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>Check you inbox at e****le@gmail.com for your 2FA code</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        sx={{ mt: 10 }}
        overwriteLabel={{
          isPersistent: (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Trusted device
              <Typography sx={{ flex: 1 }} align="right">Didn't receive OTP?</Typography>
              <Button variant="text" disabled={result.isLoading} sx={{ textTransform: "initial", ...theme.typography.body1 }}>Resend OTP</Button>
            </Box>
          ),
        }}
        onSubmit={onSubmit}
      />
      <Box sx={{ flex: 1 }} />
      <CustomLink to="/login" align="center" onClick={onReturnToLogin}>Return to login</CustomLink>
    </Box>
  );
}

export default Login2faModal;
