import { PasswordValidatonResult, validatePassword } from "@/common/rule";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import PasswordValidatonDisplayer from "@/components/PasswordValidatonDisplayer";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { RegisterConfirmedEmailCommand } from "@/models/apis/auth/registerConfirmedEmail";
import { useRegisterConfirmedEmailMutation } from "@/redux/apis/authApi";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RegisterReducerState } from "./useRegisterReducer";

type RegisterInput = RegisterConfirmedEmailCommand & {
  agreed: boolean;
};

type RegisterModalProps = {
  registerState: RegisterReducerState;
  onSuccess?: () => void;
  onChangeEmail?: MouseEventHandler<HTMLButtonElement>;
};

function RegisterModal({
  registerState,
  onSuccess = CONFIG.EMPTY_FUNCTION,
  onChangeEmail = CONFIG.EMPTY_FUNCTION,
}: RegisterModalProps) {
  const theme = useTheme();
  const { t: tAuth } = useTranslation("auth");
  const [registerConfirmedEmail, result] = useRegisterConfirmedEmailMutation();
  const formContext = useForm<RegisterInput>({
    defaultValues: {
      email: registerState.email,
      firstName: "",
      lastName: "",
      middleName: "",
      password: "",
      token: registerState.token,
      agreed: false,
    },
    mode: "onSubmit",
  });
  const { watch } = formContext;
  const password = watch("password");
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidatonResult>(validatePassword(password));
  const formModel: DynamicFormModel<RegisterInput> = {
    submitButtonText: tAuth("sign_up"),
    inputs: [
      {
        name: "email",
        label: tAuth("email"),
        inputType: "email",
        required: true,
        readOnly: true,
      },
      {
        name: "username",
        label: tAuth("username"),
        inputType: "text",
        required: true,
      },
      {
        name: "firstName",
        label: tAuth("first_name"),
        inputType: "text",
        required: true,
        maxLength: CONFIG.NAME_MAX_LENGTH,
        rules: {
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAuth("invalid_name"),
          },
        },
      },
      {
        name: "middleName",
        label: tAuth("middle_name"),
        inputType: "text",
        maxLength: CONFIG.NAME_MAX_LENGTH,
        rules: {
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAuth("invalid_name"),
          },
        },
      },
      {
        name: "lastName",
        label: tAuth("last_name"),
        inputType: "text",
        required: true,
        maxLength: CONFIG.NAME_MAX_LENGTH,
        rules: {
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAuth("invalid_name"),
          },
        },
      },
      {
        name: "password",
        label: tAuth("password"),
        inputType: "password",
        required: true,
        validateOnChange: true,
      },
      {
        name: "agreed",
        inputType: "checkbox",
        required: true,
      },
    ],
  };

  const handleSubmit: SubmitHandler<RegisterInput> = async (data) => {
    const response = await registerConfirmedEmail(data);
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
      <Typography variant="h4" align="center">{tAuth("create_account")}</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>{tAuth("finish_registration_subtitle")}</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        sx={{ mt: 10 }}
        endAdornmentMap={{
          email: (
            <IconButton
              aria-label="change email"
              edge="end"
              onClick={onChangeEmail}
            >
              <EditIcon />
            </IconButton>
          ),
        }}
        rulesMap={{
          password: {
            validate: (value) => {
              const validationResult = validatePassword(value);
              setPasswordValidation(validationResult);
              const isPasswordValid = Object.values(validationResult).every((key) => key === true);

              return isPasswordValid;
            },
          },
        }}
        labelMap={{
          agreed: (<>{tAuth("agree_to_terms_prefix")} <CustomLink to="/terms-and-conditions" target="_blank">{tAuth("terms_and_conditions")}</CustomLink></>),
        }}
        onSubmit={handleSubmit}
      />
      <PasswordValidatonDisplayer validationResult={passwordValidation} sx={{ mt: 4 }} />
    </Box>
  );
}

export default RegisterModal;
