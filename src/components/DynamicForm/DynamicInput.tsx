import CONFIG from "@/configs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { DynamicInputModel } from "./models";

type DynamicInputProps<T extends Record<string, any>, K extends Path<T>> = {
  model: DynamicInputModel<T, K>;
  formContext: UseFormReturn<T>;
  loading?: boolean;
  overwriteStartAdornment?: React.ReactNode;
  overwriteEndAdornment?: React.ReactNode;
  overwriteLabel?: React.ReactNode;
  overwriteRules?: DynamicInputModel<T, K>["rules"];
};

function DynamicInput<T extends Record<string, any>, K extends Path<T>>({
  model,
  formContext,
  loading = false,
  overwriteStartAdornment,
  overwriteEndAdornment,
  overwriteLabel,
  overwriteRules,
}: DynamicInputProps<T, K>) {
  const [showPassword, setShowPassword] = useState(false);

  if (model.inputType === "text") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={overwriteLabel || model.label}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type="text"
            slotProps={{
              input: {
                readOnly: model.readonly || loading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: overwriteStartAdornment && (
                  <InputAdornment position="start">
                    {overwriteStartAdornment}
                  </InputAdornment>
                ),
                endAdornment: overwriteEndAdornment && (
                  <InputAdornment position="end">
                    {overwriteEndAdornment}
                  </InputAdornment>
                ),
              },
              htmlInput: {
                minLength: model.minLength,
                maxLength: model.maxLength,
              },
            }}
            {...field}
            onChange={
              model.validateOnChange
                ? (event) => {
                  field.onChange(event);
                  // trigger validation
                  formContext.trigger(model.name);
                }
                : field.onChange
            }
          />
        )}
      />
    );
  }

  if (model.inputType === "email") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          pattern: {
            ignoreCase: true,
            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Invalid email address",
          },
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={overwriteLabel || model.label}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type="email"
            slotProps={{
              input: {
                readOnly: model.readonly || loading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: overwriteStartAdornment && (
                  <InputAdornment position="start">
                    {overwriteStartAdornment}
                  </InputAdornment>
                ),
                endAdornment: overwriteEndAdornment && (
                  <InputAdornment position="end">
                    {overwriteEndAdornment}
                  </InputAdornment>
                ),
              },
              htmlInput: {
                minLength: model.minLength,
                maxLength: model.maxLength || CONFIG.EMAIL_MAX_LENGTH,
              },
            }}
            {...field}
            onChange={
              model.validateOnChange
                ? (event) => {
                  field.onChange(event);
                  // trigger validation
                  formContext.trigger(model.name);
                }
                : field.onChange
            }
          />
        )}
      />
    );
  }

  if (model.inputType === "password") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={overwriteLabel || model.label}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                readOnly: model.readonly || loading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: overwriteStartAdornment && (
                  <InputAdornment position="start">
                    {overwriteStartAdornment}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {overwriteEndAdornment || (
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
              htmlInput: {
                minLength: model.minLength || CONFIG.PASSWORD_MIN_LENGTH,
                maxLength: model.maxLength || CONFIG.PASSWORD_MAX_LENGTH,
              },
            }}
            {...field}
            onChange={
              model.validateOnChange
                ? (event) => {
                  field.onChange(event);
                  // trigger validation
                  formContext.trigger(model.name);
                }
                : field.onChange
            }
          />
        )}
      />
    );
  }

  if (model.inputType === "checkbox") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.invalid} component="fieldset" sx={{ display: "flex" }}>
            <FormControlLabel
              slotProps={{
                typography: {
                  sx: {
                    flex: 1,
                  },
                },
              }}
              control={<Checkbox
                required={model.required}
                disabled={model.readonly || loading}
                {...field}
                onChange={
                  model.validateOnChange
                    ? (event) => {
                      field.onChange(event);
                      // trigger validation
                      formContext.trigger(model.name);
                    }
                    : field.onChange
                }
              />}
              label={overwriteLabel || model.label}
            />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  if (model.inputType === "hidden") {
    return (
      <input type="hidden" required={model.required} {...formContext.register(model.name, model.rules)} />
    );
  }
}

export default DynamicInput;
