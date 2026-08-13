import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { Problem } from "@/models/apis/common";
import { useForgotPasswordMutation } from "@/redux/apis/authApi";
import LockResetIcon from "@mui/icons-material/LockReset";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch, MouseEventHandler, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPasswordReducerAction, ForgotPasswordReducerState } from "./useForgotPasswordReducer";

type VerifyTokenModalProps = {
  forgotPasswordState: ForgotPasswordReducerState;
  forgotPasswordDispatch: ActionDispatch<[ForgotPasswordReducerAction]>;
  onChangeEmail?: MouseEventHandler<HTMLAnchorElement>;
};

function VerifyTokenModal({
  forgotPasswordState,
  forgotPasswordDispatch,
  onChangeEmail = CONFIG.EMPTY_FUNCTION,
}: VerifyTokenModalProps) {
  const theme = useTheme();
  const { t } = useTranslation("auth");
  const [resendToken, result] = useForgotPasswordMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (forgotPasswordState.emailCountdown > 0) {
        forgotPasswordDispatch({
          type: "REFRESH_EMAIL_COUNTDOWN",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPasswordState.emailCountdown]);

  const handleResendEmail: MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await resendToken(forgotPasswordState.forgotPasswordCommand);
    if (response.data) {
      forgotPasswordDispatch({
        type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE",
        payload: response.data,
      });
    } else if (response.error.code === "Identity-005" && "data" in response.error) {
      // send token failed because email sending is cooldown => start countdown
      const problem = response.error.data as Problem;
      if ("sentTime" in problem.data && "cooldown" in problem.data) {
        forgotPasswordDispatch({
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
      <LockResetIcon
        sx={{
          fontSize: 100,
          mx: "auto",
        }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{t("verify_email")}</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>{t("verify_email_subtitle", { email: forgotPasswordState.maskedEmail })}</Typography>
      {forgotPasswordState.emailCountdown > 0
        ? (
          <Typography align="right">{t("resend_email_countdown", { seconds: forgotPasswordState.emailCountdown })}</Typography>
        )
        : (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}>
            <Typography>{t("did_not_receive_email")}</Typography>
            <Button
              variant="text"
              disabled={result.isLoading}
              sx={{ textTransform: "initial", ...theme.typography.body1 }}
              onClick={handleResendEmail}>
              {t("resend_email")}
            </Button>
          </Box>
        )}
      <Box sx={{ flex: 1 }} />
      <CustomLink to="" align="center" onClick={onChangeEmail}>{t("use_different_email")}</CustomLink>
    </Box>
  );
}

export default VerifyTokenModal;
