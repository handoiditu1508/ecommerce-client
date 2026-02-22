import CONFIG from "@/configs";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
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

  if (model.inputType === "select") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.disabled}
          >
            <InputLabel>{overwriteLabel || model.label}</InputLabel>
            <Select
              label={overwriteLabel || model.label}
              readOnly={model.readonly || loading}
              multiple={model.multiple}
              displayEmpty={!!model.placeholder && !model.label}
              renderValue={(selected) => {
                const isNotSelected = !selected || (Array.isArray(selected) && selected.length === 0);
                if (isNotSelected && model.placeholder && !model.label) {
                  return <span style={{ color: theme.vars.palette.text.disabled }}>{model.placeholder}</span>;
                }

                if (model.showSelectedAsChips) {
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {Array.isArray(selected)
                        ? (selected as any[]).map((value) => <Chip key={value} label={value} size="small" />)
                        : <Chip label={selected} size="small" />}
                    </Box>
                  );
                }

                return Array.isArray(selected) ? (selected as any[]).join(", ") : selected;
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
            >
              {model.showCheckbox
                ? model.options.map((option) => {
                  const selected = model.multiple && Array.isArray(field.value) ? field.value.includes(option.value) : field.value === option.value;
                  const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                  return (
                    <MenuItem key={option.key} value={option.value}>
                      <SelectionIcon fontSize="small" style={{ marginRight: 8, padding: 9, boxSizing: "content-box" }} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  );
                })
                : model.options.map((option) => (
                  <MenuItem key={option.key} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
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
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.readonly || loading}>
            <FormControlLabel
              slotProps={{
                typography: {
                  sx: {
                    flex: 1,
                  },
                },
              }}
              control={<Checkbox
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
