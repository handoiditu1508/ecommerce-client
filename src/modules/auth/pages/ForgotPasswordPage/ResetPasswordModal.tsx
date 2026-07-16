import { PasswordValidatonResult, validatePassword } from "@/common/rule";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import PasswordValidatonDisplayer from "@/components/PasswordValidatonDisplayer";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { ResetPasswordCommand } from "@/models/apis/auth/resetPassword";
import { useResetPasswordMutation } from "@/redux/apis/authApi";
import LockResetIcon from "@mui/icons-material/LockReset";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ForgotPasswordReducerState } from "./useForgotPasswordReducer";

type ResetPasswordInput = ResetPasswordCommand & {
  repassword: string;
};

type ResetPasswordModalProps = {
  forgotPasswordState: ForgotPasswordReducerState;
  onSuccess?: () => void;
};

function ResetPasswordModal({
  forgotPasswordState,
  onSuccess = CONFIG.EMPTY_FUNCTION,
}: ResetPasswordModalProps) {
  const theme = useTheme();
  const { t: tAuth } = useTranslation("auth");

  const formModel: DynamicFormModel<ResetPasswordInput> = {
    submitButtonText: tAuth("reset_password"),
    inputs: [
      {
        name: "newPassword",
        inputType: "password",
        required: true,
        label: tAuth("new_password"),
      },
      {
        name: "repassword",
        inputType: "password",
        required: true,
        label: tAuth("confirm_password"),
        rules: {
          validate: (value, formValues) => value === formValues.newPassword || tAuth("password_not_match"),
        },
      },
    ],
  };

  const [resetPassword, result] = useResetPasswordMutation();
  const formContext = useForm<ResetPasswordInput>({
    defaultValues: {
      ...forgotPasswordState.resetPasswordCommand,
      repassword: "",
    },
    mode: "onChange",
  });
  const { watch } = formContext;
  const password = watch("newPassword");
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidatonResult>(validatePassword(password));

  const handleSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
    const response = await resetPassword(data);
    if (!response.error) {
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
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>{tAuth("reset_password")}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        sx={{ mt: 10 }}
        rulesMap={{
          newPassword: {
            validate: (value) => {
              const validationResult = validatePassword(value);
              setPasswordValidation(validationResult);
              const isPasswordValid = Object.values(validationResult).every((key) => key === true);

              return isPasswordValid;
            },
          },
        }}
        onSubmit={handleSubmit}
      />
      <PasswordValidatonDisplayer validationResult={passwordValidation} sx={{ mt: 4 }} />
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

export default ResetPasswordModal;
