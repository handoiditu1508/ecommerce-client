import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { SendPreConfirmEmailCommand } from "@/models/apis/sendPreConfirmEmail";
import { useSendPreConfirmEmailMutation } from "@/redux/apis/authApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RegisterReducerAction, RegisterReducerState } from "./useRegisterReducer";

const formModel: DynamicFormModel<SendPreConfirmEmailCommand> = {
  submitButtonText: "Sign up",
  inputs: [
    {
      name: "email",
      inputType: "email",
      required: true,
      placeholder: "Email address",
      rules: {
        required: "This field is required",
      },
      textAlign: "center",
    },
  ],
};

type SendPreConfirmEmailModalProps = {
  registerState: RegisterReducerState;
  registerDispatch: ActionDispatch<[RegisterReducerAction]>;
  onSuccess?: () => void;
};

function SendPreConfirmEmailModal({
  registerState,
  registerDispatch,
  onSuccess = CONFIG.EMPTY_FUNCTION,
}: SendPreConfirmEmailModalProps) {
  const theme = useTheme();
  const { t: tError } = useTranslation("errors");
  const [sendPreconfirmEmail, result] = useSendPreConfirmEmailMutation();
  const formContext = useForm<SendPreConfirmEmailCommand>({
    defaultValues: {
      email: registerState.email,
    },
    mode: "onSubmit",
  });
  const { setError } = formContext;

  const handleSubmit: SubmitHandler<SendPreConfirmEmailCommand> = async (data) => {
    const response = await sendPreconfirmEmail(data);
    if (response.data) {
      registerDispatch({ type: "SET_EMAIL", payload: data.email });
      registerDispatch({
        type: "SET_COOLDOWN_FROM_RESPONSE",
        payload: response.data,
      });
      onSuccess();
    } else {
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
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        sx={{ mt: 10 }}
        onSubmit={handleSubmit}
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
      <Typography align="center">Already have an account? <CustomLink to="/login">Sign in</CustomLink></Typography>
    </Box>
  );
}

export default SendPreConfirmEmailModal;
