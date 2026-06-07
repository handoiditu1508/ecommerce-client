import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { ForgotPasswordCommand } from "@/models/apis/auth/forgotPassword";
import { Problem } from "@/models/apis/common";
import { useForgotPasswordMutation } from "@/redux/apis/authApi";
import LockResetIcon from "@mui/icons-material/LockReset";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ForgotPasswordReducerAction, ForgotPasswordReducerState } from "./useForgotPasswordReducer";

type SendEmailModalProps = {
  forgotPasswordState: ForgotPasswordReducerState;
  forgotPasswordDispatch: ActionDispatch<[ForgotPasswordReducerAction]>;
  onSuccess?: () => void;
};

function SendEmailModal({
  forgotPasswordState,
  forgotPasswordDispatch,
  onSuccess = CONFIG.EMPTY_FUNCTION,
}: SendEmailModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { t: tAuth } = useTranslation("auth");

  const formModel: DynamicFormModel<ForgotPasswordCommand> = {
    submitButtonText: tAuth("send_otp"),
    inputs: [
      {
        name: "username",
        inputType: "text",
        rules: {
          required: t("this_field_is_required"),
        },
        placeholder: tAuth("username_or_email"),
        textAlign: "center",
      },
    ],
  };

  const [forgotPassword, result] = useForgotPasswordMutation();
  const formContext = useForm<ForgotPasswordCommand>({
    defaultValues: {
      ...forgotPasswordState.forgotPasswordCommand,
    },
    mode: "onSubmit",
  });

  const handleSubmit: SubmitHandler<ForgotPasswordCommand> = async (data) => {
    const response = await forgotPassword(data);
    if (response.data) {
      forgotPasswordDispatch({
        type: "SET_FORGOT_PASSWORD_COMMAND",
        payload: data,
      });
      forgotPasswordDispatch({
        type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE",
        payload: response.data,
      });
      forgotPasswordDispatch({
        type: "SET_MASKED_EMAIL",
        payload: response.data.maskedEmail,
      });
      onSuccess();
    } else if (response.error.code === "Identity-005") {
      // email already sent and need to wait before can send more => to verify otp step

      forgotPasswordDispatch({
        type: "SET_FORGOT_PASSWORD_COMMAND",
        payload: data,
      });

      // in case count down still keep the state before go back to send email step
      forgotPasswordDispatch({
        type: "RESET_EMAIL_COUNTDOWN",
      });

      if ("data" in response.error) {
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
      <LockResetIcon
        sx={{
          fontSize: 100,
          mx: "auto",
        }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{tAuth("forgot_password")}</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>{tAuth("send_otp_subtitle")}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        onSubmit={handleSubmit}
      />
      <Box sx={{ flex: 1 }} />
      <CustomLink
        to="/login"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          mx: "auto",
        }}>
        <NavigateBeforeIcon fontSize="inherit" /> {tAuth("return_to_login")}
      </CustomLink>
    </Box>
  );
}

export default SendEmailModal;
