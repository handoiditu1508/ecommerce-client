import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { useSendPreConfirmEmailMutation } from "@/redux/apis/authApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch, MouseEventHandler, useEffect } from "react";
import { RegisterReducerAction, RegisterReducerState } from "./useRegisterReducer";

type VerifyEmailModalProps = {
  registerState: RegisterReducerState;
  registerDispatch: ActionDispatch<[RegisterReducerAction]>;
  onChangeEmail?: MouseEventHandler<HTMLAnchorElement>;
};

function VerifyEmailModal({
  registerState,
  registerDispatch,
  onChangeEmail = CONFIG.EMPTY_FUNCTION,
}: VerifyEmailModalProps) {
  const theme = useTheme();
  const [sendPreconfirmEmail, result] = useSendPreConfirmEmailMutation();
  const isResendEmailDisabled = result.isLoading || registerState.cooldown > 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (registerState.cooldown > 0) {
      interval = setInterval(() => {
        registerDispatch({
          type: "DECREASE_COOLDOWN",
          payload: 1,
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerState.cooldown]);

  const handleResendEmail = async () => {
    if (isResendEmailDisabled) return;

    const response = await sendPreconfirmEmail({ email: registerState.email });
    if (response.data) {
      registerDispatch({
        type: "SET_COOLDOWN_FROM_RESPONSE",
        payload: response.data,
      });
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
      <Typography variant="h4" align="center">Verify Email</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>A confirmation email has been sent to your email address at e****le@gmail.com</Typography>
      {isResendEmailDisabled
        ? <Typography textAlign="end">Resend email in {registerState.cooldown} seconds</Typography>
        : (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}>
            <Typography>Didn't receive email?</Typography>
            <Button
              variant="text"
              sx={{ textTransform: "initial", ...theme.typography.body1 }}
              onClick={handleResendEmail}>
              Resend email
            </Button>
          </Box>
        )}
      <Box sx={{ flex: 1 }} />
      <CustomLink to="" align="center" onClick={onChangeEmail}>Use different email</CustomLink>
    </Box>
  );
}

export default VerifyEmailModal;
