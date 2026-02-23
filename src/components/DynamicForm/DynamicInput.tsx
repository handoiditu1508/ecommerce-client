import CONFIG from "@/configs";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Autocomplete, { AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
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
import { DynamicInputModel, DynamicInputOption } from "./models";

type DynamicInputProps<T extends Record<string, any>, K extends Path<T>> = {
  model: DynamicInputModel<T, K>;
  formContext: UseFormReturn<T>;
  formLoading?: boolean;
  overwriteStartAdornment?: React.ReactNode;
  overwriteEndAdornment?: React.ReactNode;
  overwriteLabel?: React.ReactNode;
  overwriteRules?: DynamicInputModel<T, K>["rules"];
  overwriteOptions?: DynamicInputOption<T, K>[];
  overwriteAutocompleteRenderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  overwriteAutocompleteRenderOption?: AutocompleteProps<DynamicInputOption<T, K>, boolean | undefined, boolean, boolean, "div">["renderOption"];
  overwriteOnInputChange?: (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void;
  overwriteLoading?: boolean;
};

function DynamicInput<T extends Record<string, any>, K extends Path<T>>({
  model,
  formContext,
  formLoading = false,
  overwriteStartAdornment,
  overwriteEndAdornment,
  overwriteLabel,
  overwriteRules,
  overwriteOptions,
  overwriteAutocompleteRenderInput,
  overwriteAutocompleteRenderOption,
  overwriteOnInputChange,
  overwriteLoading,
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
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readonly || formLoading,
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
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readonly || formLoading,
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
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readonly || formLoading,
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
                sx: {
                  "&::-ms-reveal": {
                    display: "none",
                  },
                },
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
    const options = overwriteOptions || model.options;

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
              readOnly={model.readonly || formLoading}
              multiple={model.multiple}
              displayEmpty={!!model.placeholder && !model.label}
              startAdornment={overwriteStartAdornment && (
                <InputAdornment position="start">
                  {overwriteStartAdornment}
                </InputAdornment>
              )}
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
                ? options.map((option) => {
                  const selected = model.multiple && Array.isArray(field.value) ? field.value.includes(option.value) : field.value === option.value;
                  const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                  return (
                    <MenuItem key={option.key} value={option.value}>
                      <SelectionIcon fontSize="small" style={{ marginRight: 8, padding: 9, boxSizing: "content-box" }} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  );
                })
                : options.map((option) => (
                  <MenuItem key={option.key} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  // todo: features omitted for simplicity and to be implemented in the future when needed:
  // creatable, grouped, disabled options, fixed option, showSelectedAsChips, showCheckbox, limit tags
  if (model.inputType === "autocomplete") {
    const options = overwriteOptions || model.options;

    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...overwriteRules,
        }}
        render={({ field, fieldState }) => (
          <Autocomplete
            fullWidth
            options={options}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            getOptionKey={(option) => (typeof option === "string" ? "" : option.key)}
            disabled={model.disabled}
            readOnly={model.readonly || formLoading}
            multiple={model.multiple}
            freeSolo={model.freeSolo}
            filterOptions={model.searchAsYouType ? (options) => options : undefined}
            autoComplete={model.searchAsYouType}
            includeInputInList={model.searchAsYouType}
            noOptionsText="Empty"
            onInputChange={overwriteOnInputChange}
            {...field}
            renderOption={overwriteAutocompleteRenderOption as any}
            renderInput={overwriteAutocompleteRenderInput || ((params) => (
              <TextField
                {...params}
                required={model.required}
                label={overwriteLabel || model.label}
                placeholder={model.placeholder}
                margin="normal"
                error={fieldState.invalid}
                helperText={fieldState.error && fieldState.error.message}
                type="text"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: overwriteStartAdornment
                      ? (
                        <InputAdornment position="start">
                          {overwriteStartAdornment}
                        </InputAdornment>
                      )
                      : params.InputProps.startAdornment,
                    endAdornment: (
                      <>
                        {
                          overwriteEndAdornment
                            ? (
                              <InputAdornment position="end">
                                {overwriteEndAdornment}
                              </InputAdornment>
                            )
                            : overwriteLoading
                              ? (
                                <InputAdornment position="end">
                                  <CircularProgress color="inherit" size={20} />
                                </InputAdornment>
                              )
                              : null
                        }
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            ))}
            // Convert string -> object for Autocomplete
            value={options.find((option) => option.value === field.value) || null}
            // Convert object -> string for RHF
            onChange={
              (event, value, _reason, _details) => {
                if (typeof value === "string") {
                  field.onChange(event, value);
                } else if (Array.isArray(value)) {
                  field.onChange(event, value.map((v) => (typeof v === "string" ? v : v.value)));
                } else {
                  field.onChange(event, value ? value.value : "");
                }

                if (model.validateOnChange) {
                  // trigger validation
                  formContext.trigger(model.name);
                }
              }
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
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.readonly || formLoading || model.disabled}>
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
