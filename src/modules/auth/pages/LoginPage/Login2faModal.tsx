import { preventDefault } from "@/common/event";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { Login2faCommand } from "@/models/apis/auth/login2fa";
import { Problem } from "@/models/apis/common";
import { useLogin2faMutation, useLoginGoogleMutation, useLoginMutation } from "@/redux/apis/authApi";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch, MouseEventHandler, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LoginReducerAction, LoginReducerState } from "./useLoginReducer";

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
  const { t } = useTranslation(["auth", "translation"]);

  const formModel: DynamicFormModel<Login2faCommand> = {
    submitButtonText: t("sign_in"),
    inputs: [
      {
        name: "token",
        inputType: "text",
        rules: {
          required: t("translation:this_field_is_required"),
        },
        placeholder: t("enter_otp"),
        textAlign: "center",
      },
    ],
    postActionInputs: [
      {
        name: "isPersistent",
        inputType: "checkbox",
        label: t("trusted_device"),
      },
    ],
  };

  const [login2fa, result] = useLogin2faMutation();
  const [resendOtp, resendOtpResult] = useLoginMutation();
  const [resendGoogleOtp, resendGoogleOtpResult] = useLoginGoogleMutation();
  const loading = result.isLoading || resendOtpResult.isLoading || resendGoogleOtpResult.isLoading;
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

  const handleGoogleResendCredential = async (idToken: string) => {
    const response = await resendGoogleOtp({
      idToken,
      isPersistent: formContext.getValues("isPersistent"),
    });
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
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{t("two_factor_authentication")}</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>{t("check_inbox_otp_subtitle")}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={loading}
        sx={{ mt: 10 }}
        labelMap={{
          isPersistent: (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {t("trusted_device")}
              {loginState.emailCountdown > 0
                ? (
                  <Typography sx={{ flex: 1, cursor: "initial" }} align="right" onClick={preventDefault}>
                    {t("resend_otp_countdown", { seconds: loginState.emailCountdown })}
                  </Typography>
                )
                : loginState.loginMethod === "google"
                  ? (<>
                    <Typography sx={{ flex: 1, cursor: "initial" }} align="right" onClick={preventDefault}>{t("did_not_receive_otp")}</Typography>
                    <Box sx={{ width: 180 }}>
                      <GoogleSignInButton
                        disabled={loading}
                        size="medium"
                        text="continue_with"
                        onCredential={handleGoogleResendCredential}
                      />
                    </Box>
                  </>)
                  : (<>
                    <Typography sx={{ flex: 1, cursor: "initial" }} align="right" onClick={preventDefault}>{t("did_not_receive_otp")}</Typography>
                    <Button variant="text" disabled={loading} sx={{ textTransform: "initial", ...theme.typography.body1 }} onClick={handleResentOtp}>{t("resend_otp")}</Button>
                  </>)}
            </Box>
          ),
        }}
        onSubmit={handleSubmit}
      />
      <Box sx={{ flex: 1 }} />
      <CustomLink to="/login" align="center" onClick={onReturnToLogin}>{t("return_to_login")}</CustomLink>
    </Box>
  );
}

export default Login2faModal;
