import { PasswordValidatonResult, validatePassword } from "@/common/rules";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type RegisterInput = {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  agreed: boolean;
};

type AdditionalInfoModalProps = {
  onSuccess?: () => void;
  onChangeEmail?: MouseEventHandler<HTMLButtonElement>;
};

function AdditionalInfoModal({ onSuccess = CONFIG.EMPTY_FUNCTION, onChangeEmail = CONFIG.EMPTY_FUNCTION }: AdditionalInfoModalProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, watch, trigger } = useForm<RegisterInput>({
    defaultValues: {
      email: "example@gmail.com",
      firstName: "",
      lastName: "",
      middleName: "",
      password: "",
      agreed: false,
    },
    mode: "onSubmit",
  });
  const password = watch("password");
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidatonResult>(validatePassword(password));

  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
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
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Create Account</Typography>
      <Typography variant="subtitle1" align="center" sx={{ mt: 0.5 }}>Finish your registration</Typography>
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
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="change email"
                        edge="end"
                        onClick={onChangeEmail}
                      >
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: CONFIG.EMAIL_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="firstName"
          rules={{
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Invalid name",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              required
              label="First Name"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              slotProps={{
                htmlInput: {
                  readOnly: loading,
                  maxLength: CONFIG.NAME_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="middleName"
          rules={{
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Invalid name",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              label="Middle Name"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              slotProps={{
                htmlInput: {
                  readOnly: loading,
                  maxLength: CONFIG.NAME_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          rules={{
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Invalid name",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              required
              label="Last Name"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              slotProps={{
                htmlInput: {
                  readOnly: loading,
                  maxLength: CONFIG.NAME_MAX_LENGTH,
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
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
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              error={fieldState.invalid}
              helperText={fieldState.error && fieldState.error.message}
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
              onChange={(event) => {
                field.onChange(event);
                // trigger password validation
                trigger("password");
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="agreed"
          render={({ field, fieldState }) => (
            <FormControl error={fieldState.invalid} component="fieldset">
              <FormControlLabel
                control={<Checkbox required disabled={loading} />}
                label={<>I've read and agree to the <CustomLink to="/terms-and-conditions" target="_blank">Terms & Conditions</CustomLink></>}
                {...field}
              />
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>Sign up</Button>
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
    </Box>
  );
}

export default AdditionalInfoModal;
