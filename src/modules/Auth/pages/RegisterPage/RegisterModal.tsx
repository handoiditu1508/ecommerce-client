import { PasswordValidatonResult, validatePassword } from "@/common/rules";
import CustomLink from "@/components/CustomLink";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { RegisterConfirmedEmailCommand } from "@/models/apis/registerConfirmedEmail";
import { useRegisterConfirmedEmailMutation } from "@/redux/apis/authApi";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterReducerState } from "./useRegisterReducer";

const formModel: DynamicFormModel<RegisterInput> = {
  submitButtonText: "Sign up",
  inputs: [
    {
      name: "email",
      label: "Email",
      inputType: "email",
      required: true,
      readonly: true,
    },
    {
      name: "firstName",
      label: "First Name",
      inputType: "text",
      required: true,
      maxLength: CONFIG.NAME_MAX_LENGTH,
      rules: {
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "Invalid name",
        },
      },
    },
    {
      name: "middleName",
      label: "Middle Name",
      inputType: "text",
      maxLength: CONFIG.NAME_MAX_LENGTH,
      rules: {
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "Invalid name",
        },
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      inputType: "text",
      required: true,
      maxLength: CONFIG.NAME_MAX_LENGTH,
      rules: {
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "Invalid name",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      inputType: "password",
      required: true,
      validateOnChange: true,
    },
    {
      name: "token",
      inputType: "hidden",
      required: true,
    },
    {
      name: "agreed",
      inputType: "checkbox",
      required: true,
    },
  ],
};

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

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
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
      <Typography variant="h4" align="center">Create Account</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>Finish your registration</Typography>
      <DynamicForm
        model={formModel}
        formContext={formContext}
        loading={result.isLoading}
        sx={{ mt: 10 }}
        overwriteEndAdornments={{
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
        overwriteRules={{
          password: {
            validate: (value) => {
              const validationResult = validatePassword(value);
              setPasswordValidation(validationResult);
              const isPasswordValid = Object.values(validationResult).every((key) => key === true);

              return isPasswordValid;
            },
          },
        }}
        overwriteLabels={{
          agreed: (<>I've read and agree to the <CustomLink to="/terms-and-conditions" target="_blank">Terms & Conditions</CustomLink></>),
        }}
        onSubmit={onSubmit}
      />
      <Box sx={{ mt: 4 }}>
        <Box sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          color: passwordValidation.minLength ? theme.vars.palette.success.main : theme.vars.palette.error.main,
          ...theme.typography.body1,
        }}>
          {passwordValidation.minLength ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
          Password must at least 8 characters.
        </Box>
        <Box sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          color: passwordValidation.special ? theme.vars.palette.success.main : theme.vars.palette.error.main,
          ...theme.typography.body1,
        }}>
          {passwordValidation.special ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
          Password requires special character.
        </Box>
        <Box sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          color: passwordValidation.lower ? theme.vars.palette.success.main : theme.vars.palette.error.main,
          ...theme.typography.body1,
        }}>
          {passwordValidation.lower ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
          Password requires lowercase character.
        </Box>
        <Box sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          color: passwordValidation.upper ? theme.vars.palette.success.main : theme.vars.palette.error.main,
          ...theme.typography.body1,
        }}>
          {passwordValidation.upper ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
          Password requires uppercase character.
        </Box>
        <Box sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          color: passwordValidation.number ? theme.vars.palette.success.main : theme.vars.palette.error.main,
          ...theme.typography.body1,
        }}>
          {passwordValidation.number ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
          Password requires numeric character.
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterModal;
