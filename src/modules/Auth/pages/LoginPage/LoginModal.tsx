import logo from "@/assets/logo.svg";
import { preventDefault } from "@/common/eventHelpers";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { Problem } from "@/models/apis/common";
import { LoginCommand } from "@/models/apis/login";
import { useLoginMutation } from "@/redux/apis/authApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginReducerAction, LoginReducerState } from "./useLoginReducer";

const formModel: DynamicFormModel<LoginCommand> = {
  submitButtonText: "Sign in",
  inputs: [
    {
      name: "username",
      inputType: "text",
      label: "Email or Username",
      rules: {
        required: "This field is required",
      },
    },
    {
      name: "password",
      inputType: "password",
      label: "Password",
      rules: {
        required: "This field is required",
      },
    },
    {
      name: "isPersistent",
      inputType: "checkbox",
      label: "Remember me",
    },
  ],
};

type LoginModalProps = {
  loginState: LoginReducerState;
  loginDispatch: ActionDispatch<[LoginReducerAction]>;
  onLogin2fa?: () => void;
  onSuccess?: () => void;
};

function LoginModal({
  loginState,
  loginDispatch,
  onLogin2fa = CONFIG.EMPTY_FUNCTION,
  onSuccess = CONFIG.EMPTY_FUNCTION,
}: LoginModalProps) {
  const theme = useTheme();
  const [login, result] = useLoginMutation();
  const formContext = useForm<LoginCommand>({
    defaultValues: {
      ...loginState.loginCommand,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginCommand> = async (data) => {
    const response = await login(data);
    if (response.data) {
      if (response.data.twoFactorAuthenticate) {
        loginDispatch({
          type: "SET_LOGIN_COMMAND",
          payload: data,
        });
        loginDispatch({
          type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE",
          payload: response.data,
        });
        onLogin2fa();
      } else {
        onSuccess();
      }
    } else {
      // 2fa otp email already sent and need to wait before can send more => to login 2fa step
      if (response.error.code === "Identity-005") {
        loginDispatch({
          type: "SET_LOGIN_COMMAND",
          payload: data,
        });

        if ("data" in response.error) {
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

        onLogin2fa();
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
      <Box component="img" src={logo} alt="logo" width={100} height={100} sx={{ mx: "auto", display: "block" }} />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Welcome to {CONFIG.APP_NAME}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        overwriteLabel={{
          isPersistent: (<Box sx={{ display: "flex" }}>
            Remember me
            <Box sx={{ flex: 1, cursor: "initial" }} onClick={preventDefault} />
            <CustomLink to="/forgot-password">Forgot Password?</CustomLink>
          </Box>),
        }}
        onSubmit={onSubmit}
      />
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
      <Typography align="center">Don't have an account? <CustomLink to="/register">Sign up</CustomLink></Typography>
    </Box>
  );
}

export default LoginModal;
