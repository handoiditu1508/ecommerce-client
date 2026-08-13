import logo from "@/assets/logo.svg";
import { preventDefault } from "@/common/event";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { LoginCommand } from "@/models/apis/auth/login";
import { Problem } from "@/models/apis/common";
import { useLoginMutation } from "@/redux/apis/authApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LoginReducerAction, LoginReducerState } from "./useLoginReducer";

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
  const { t } = useTranslation(["auth", "translation"]);

  const formModel: DynamicFormModel<LoginCommand> = {
    submitButtonText: t("sign_in"),
    inputs: [
      {
        name: "username",
        inputType: "text",
        label: t("email_or_username"),
        rules: {
          required: t("translation:this_field_is_required"),
        },
      },
      {
        name: "password",
        inputType: "password",
        label: t("password"),
        rules: {
          required: t("translation:this_field_is_required"),
        },
      },
      {
        name: "isPersistent",
        inputType: "checkbox",
        label: t("remember_me"),
      },
    ],
  };

  const [login, result] = useLoginMutation();
  const formContext = useForm<LoginCommand>({
    defaultValues: {
      ...loginState.loginCommand,
    },
    mode: "onSubmit",
  });

  const handleSubmit: SubmitHandler<LoginCommand> = async (data) => {
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
    } else if (response.error.code === "Identity-005") {
      // 2fa otp email already sent and need to wait before can send more => to login 2fa step

      loginDispatch({
        type: "SET_LOGIN_COMMAND",
        payload: data,
      });

      // in case count down still keep the state before go back to login step
      loginDispatch({
        type: "RESET_EMAIL_COUNTDOWN",
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
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{t("welcome_to_app", { appName: CONFIG.APP_NAME })}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        labelMap={{
          isPersistent: (<Box sx={{ display: "flex" }}>
            {t("remember_me")}
            <Box sx={{ flex: 1, cursor: "initial" }} onClick={preventDefault} />
            <CustomLink to="/forgot-password">{t("forgot_password")}</CustomLink>
          </Box>),
        }}
        onSubmit={handleSubmit}
      />
      <Divider sx={{ my: 2 }}>{t("or_sign_in_with")}</Divider>
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
      <Typography align="center">{t("dont_have_an_account")} <CustomLink to="/register">{t("sign_up")}</CustomLink></Typography>
    </Box>
  );
}

export default LoginModal;
