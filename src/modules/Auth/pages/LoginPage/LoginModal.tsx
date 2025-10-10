import logo from "@/assets/logo.svg";
import CustomLink from "@/components/CustomLink";
import CONFIG from "@/configs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type LoginInput = {
  username: string;
  password: string;
  remember: boolean;
};

type LoginModalProps = {
  onLogin2fa?: () => void;
  onLoginSuccess?: () => void;
};

function LoginModal({ onLogin2fa = CONFIG.EMPTY_FUNCTION, onLoginSuccess = CONFIG.EMPTY_FUNCTION }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm<LoginInput>({
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    console.log(data);
    const isLogin2fa = true;
    if (isLogin2fa) {
      onLogin2fa();
    } else {
      onLoginSuccess();
    }
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      p: 4,
      boxSizing: "border-box",
    }}>
      <Box component="img" src={logo} alt="logo" width={100} height={100} sx={{ mx: "auto", display: "block" }} />
      <Typography variant="h4" align="center" sx={{ mt: 1 }}>Welcome to {CONFIG.APP_NAME}</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="username"
          rules={{
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              label="Email or Username"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
              slotProps={{
                input: {
                  readOnly: loading,
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
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              error={!!fieldState.error}
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
              }}
              {...field}
            />
          )}
        />
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <FormControlLabel control={<Checkbox disabled={loading} />} label="Remember me" {...field} />
            )}
          />
          <CustomLink to="/forgot-password">Forgot Password?</CustomLink>
        </Box>
        <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>SIGN IN</Button>
      </form>
      <Divider sx={{ my: 2 }}>Or sign in with</Divider>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}>
        <Button fullWidth variant="outlined" disabled={loading}>Google</Button>
        <Button fullWidth variant="outlined" disabled={loading}>Facebook</Button>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Typography align="center">Don't have an account? <CustomLink to="/register">Sign up</CustomLink></Typography>
    </Box>
  );
}

export default LoginModal;
