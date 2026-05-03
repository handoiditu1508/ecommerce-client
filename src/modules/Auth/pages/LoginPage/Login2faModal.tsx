import { preventDefault } from "@/common/eventHelpers";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { Login2faCommand } from "@/models/apis/auth/login2fa";
import { Problem } from "@/models/apis/common";
import { useLogin2faMutation, useLoginMutation } from "@/redux/apis/authApi";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch, MouseEventHandler, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginReducerAction, LoginReducerState } from "./useLoginReducer";

const formModel: DynamicFormModel<Login2faCommand> = {
  submitButtonText: "Sign in",
  inputs: [
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
  loginDispatch: ActionDispatch<[LoginReducerAction]>;
  onSuccess?: () => void;
  onReturnToLogin?: MouseEventHandler<HTMLAnchorElement>;
};

function Login2faModal({
  loginState,
  loginDispatch,
  onSuccess = CONFIG.EMPTY_FUNCTION,
  onReturnToLogin = CONFIG.EMPTY_FUNCTION,
}: Login2faModalProps) {
  const theme = useTheme();
  const [login2fa, result] = useLogin2faMutation();
  const [resendOtp, resendOtpResult] = useLoginMutation();
  const loading = result.isLoading || resendOtpResult.isLoading;
  const formContext = useForm<Login2faCommand>({
    defaultValues: {
      username: loginState.loginCommand.username,
      token: "",
      isPersistent: false,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (loginState.emailCountdown > 0) {
        loginDispatch({
          type: "REFRESH_EMAIL_COUNTDOWN",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.emailCountdown]);

  const handleSubmit: SubmitHandler<Login2faCommand> = async (data) => {
    const response = await login2fa(data);
    if (response.data) {
      onSuccess();
    }
  };

  const handleResentOtp: MouseEventHandler<HTMLButtonElement> = async (_event) => {
    const response = await resendOtp(loginState.loginCommand);
    if (response.data) {
      if (response.data.twoFactorAuthenticate) {
        loginDispatch({
          type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE",
          payload: response.data,
        });
      } else {
        // somehow 2fa is disabled => successful login
        onSuccess();
      }
    } else if (response.error.code === "Identity-005" && "data" in response.error) {
      // send otp failed because email sending is cooldown => start countdown
      const problem = response.error.data as Problem;
      if ("sentTime" in problem.data && "cooldown" in problem.data) {
        loginDispatch({
          type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE",
          payload: {
            sentTime: problem.data["sentTime"] as string,
            cooldown: problem.data["cooldown"] as number,
          },
        });
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
        loading={loading}
        sx={{ mt: 10 }}
        labelMap={{
          isPersistent: (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Trusted device
              {loginState.emailCountdown > 0
                ? (
                  <Typography sx={{ flex: 1, cursor: "initial" }} align="right" onClick={preventDefault}>
                    Resend OTP in {loginState.emailCountdown} seconds
                  </Typography>
                )
                : (<>
                  <Typography sx={{ flex: 1, cursor: "initial" }} align="right" onClick={preventDefault}>Didn't receive OTP?</Typography>
                  <Button variant="text" disabled={loading} sx={{ textTransform: "initial", ...theme.typography.body1 }} onClick={handleResentOtp}>Resend OTP</Button>
                </>)}
            </Box>
          ),
        }}
        onSubmit={handleSubmit}
      />
      <Box sx={{ flex: 1 }} />
      <CustomLink to="/login" align="center" onClick={onReturnToLogin}>Return to login</CustomLink>
    </Box>
  );
}

export default Login2faModal;
