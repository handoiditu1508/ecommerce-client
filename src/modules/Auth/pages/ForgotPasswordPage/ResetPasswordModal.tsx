import { PasswordValidatonResult, validatePassword } from "@/common/rules";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type ResetPasswordInput = {
  email: string;
  newPassword: string;
};

type ResetPasswordModalProps = {
  onSuccess?: () => void;
};

function ResetPasswordModal({ onSuccess = CONFIG.EMPTY_FUNCTION }: ResetPasswordModalProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, watch, trigger } = useForm<ResetPasswordInput>({
    defaultValues: {
      email: "example@gmail.com",
      newPassword: "",
    },
    mode: "onChange",
  });
  const password = watch("newPassword");
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidatonResult>(validatePassword(password));

  const onSubmit: SubmitHandler<ResetPasswordInput> = (data) => {
    console.log(data);
    onSuccess();
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
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Reset Password</Typography>
      <Box component="form" sx={{ mt: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          rules={{
            pattern: {
              ignoreCase: true,
              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email address",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              required
              label="Email"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              type="email"
              slotProps={{
                htmlInput: {
                  readOnly: true,
                  maxLength: CONFIG.EMAIL_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          rules={{
            validate: (value) => {
              const validationResult = validatePassword(value);
              setPasswordValidation(validationResult);
              const isPasswordValid = Object.values(validationResult).every((key) => key === true);

              return isPasswordValid;
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              required
              label="New password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              // error={fieldState.invalid}
              // helperText={fieldState.error && fieldState.error.message}
              slotProps={{
                input: {
                  readOnly: loading,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: CONFIG.PASSWORD_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>Reset password</Button>
      </Box>
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
      <Box sx={{ flex: 1 }} />
      <CustomLink
        to="/login-in"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          mx: "auto",
        }}>
        <NavigateBeforeIcon fontSize="inherit" /> Return to login
      </CustomLink>
    </Box>
  );
}

export default ResetPasswordModal;
