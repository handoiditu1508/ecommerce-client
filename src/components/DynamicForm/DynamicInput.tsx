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
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FileInput from "../FileInput";
import DynamicArrayInput from "./DynamicArrayInput";
import { DynamicFormProps } from "./DynamicForm";
import { DynamicInputModel, DynamicInputOption } from "./models";

type DateTimeInputType = "date" | "time" | "datetime";

const DATE_TIME_FORMATS: Record<DateTimeInputType, string> = {
  date: "YYYY-MM-DD",
  time: "HH:mm",
  datetime: "YYYY-MM-DDTHH:mm",
};

function parseDateTimeValue(value: unknown, inputType: DateTimeInputType): Dayjs | null {
  if (typeof value !== "string" || !value) return null;

  return inputType === "time" ? dayjs(`1970-01-01T${value}`) : dayjs(value);
}

function formatDateTimeValue(value: Dayjs | null, inputType: DateTimeInputType): string | null {
  return value?.isValid() ? value.format(DATE_TIME_FORMATS[inputType]) : null;
}

type DynamicInputProps<T extends Record<string, any>, K extends Path<T>> = {
  model: DynamicInputModel<T, K>;
  formContext: UseFormReturn<T>;
  formLoading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  label?: React.ReactNode;
  rules?: DynamicInputModel<T, K>["rules"];
  options?: DynamicInputOption<T, K>[];
  autocompleteRenderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  autocompleteRenderOption?: AutocompleteProps<DynamicInputOption<T, K>, boolean | undefined, boolean, boolean, "div">["renderOption"];
  autocompleteOnInputChange?: (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void;
  autocompleteLoading?: boolean;
  hidden?: boolean | ((data: T) => boolean);

  // these props come from DynamicForm and is used for DynamicArrayInput
  startAdornmentMap?: DynamicFormProps<T>["startAdornmentMap"];
  endAdornmentMap?: DynamicFormProps<T>["endAdornmentMap"];
  labelMap?: DynamicFormProps<T>["labelMap"];
  rulesMap?: DynamicFormProps<T>["rulesMap"];
  optionsMap?: DynamicFormProps<T>["optionsMap"];
  autocompleteRenderInputMap?: DynamicFormProps<T>["autocompleteRenderInputMap"];
  autocompleteRenderOptionMap?: DynamicFormProps<T>["autocompleteRenderOptionMap"];
  autocompleteOnInputChangeMap?: DynamicFormProps<T>["autocompleteOnInputChangeMap"];
  autocompleteLoadingMap?: DynamicFormProps<T>["autocompleteLoadingMap"];
  hiddenMap?: DynamicFormProps<T>["hiddenMap"];
};

function DynamicInput<T extends Record<string, any>, K extends Path<T>>({
  model,
  formContext,
  formLoading = false,
  startAdornment,
  endAdornment,
  label,
  rules,
  options,
  autocompleteRenderInput,
  autocompleteRenderOption,
  autocompleteOnInputChange,
  autocompleteLoading,
  hidden,
  startAdornmentMap,
  endAdornmentMap,
  labelMap,
  rulesMap,
  optionsMap,
  autocompleteRenderInputMap,
  autocompleteRenderOptionMap,
  autocompleteOnInputChangeMap,
  autocompleteLoadingMap,
  hiddenMap,
}: DynamicInputProps<T, K>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const selectOptions = model.inputType === "select" ? options || model.options : undefined;
  const selectOptionLabels = useMemo<Map<unknown, string>>(
    () => new Map(selectOptions?.map((option) => [option.value, option.label] as const) ?? []),
    [selectOptions],
  );
  const data = formContext.watch();

  const hiddenProp = hidden ?? model.hidden;
  let finalHidden: boolean | undefined = typeof hiddenProp === "function" ? hiddenProp(data) : hiddenProp;
  if (finalHidden) return null;

  const finalLabel = label || model.label;

  if (model.inputType === "text") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={finalLabel}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type="text"
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readOnly || formLoading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: startAdornment && (
                  <InputAdornment position="start">
                    {startAdornment}
                  </InputAdornment>
                ),
                endAdornment: endAdornment && (
                  <InputAdornment position="end">
                    {endAdornment}
                  </InputAdornment>
                ),
              },
              htmlInput: {
                minLength: model.minLength,
                maxLength: model.maxLength,
              },
            }}
            {...field}
            value={field.value ?? ""}
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
            message: t("invalid_email_address"),
          },
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={finalLabel}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type="email"
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readOnly || formLoading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: startAdornment && (
                  <InputAdornment position="start">
                    {startAdornment}
                  </InputAdornment>
                ),
                endAdornment: endAdornment && (
                  <InputAdornment position="end">
                    {endAdornment}
                  </InputAdornment>
                ),
              },
              htmlInput: {
                minLength: model.minLength,
                maxLength: model.maxLength || CONFIG.EMAIL_MAX_LENGTH,
              },
            }}
            {...field}
            value={field.value ?? ""}
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
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            required={model.required}
            label={finalLabel}
            placeholder={model.placeholder}
            margin="normal"
            error={fieldState.invalid}
            helperText={fieldState.error && fieldState.error.message}
            type={showPassword ? "text" : "password"}
            disabled={model.disabled}
            slotProps={{
              input: {
                readOnly: model.readOnly || formLoading,
                sx: {
                  textAlign: model.textAlign,
                },
                startAdornment: startAdornment && (
                  <InputAdornment position="start">
                    {startAdornment}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {endAdornment || (
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
            value={field.value ?? ""}
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
    const finalOptions = selectOptions || model.options;
    const getOptionLabel = (value: unknown) => selectOptionLabels.get(value) ?? String(value);

    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.disabled}
          >
            <InputLabel>{finalLabel}</InputLabel>
            <Select
              label={finalLabel}
              readOnly={model.readOnly || formLoading}
              multiple={model.multiple}
              displayEmpty={!!model.placeholder && !finalLabel}
              startAdornment={startAdornment && (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              )}
              renderValue={(selected) => {
                const isNotSelected = !selected || (Array.isArray(selected) && selected.length === 0);
                if (isNotSelected && model.placeholder && !finalLabel) {
                  return <span style={{ color: theme.vars.palette.text.disabled }}>{model.placeholder}</span>;
                }

                if (model.showSelectedAsChips) {
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {Array.isArray(selected)
                        ? selected.map((value: unknown) => <Chip key={String(value)} label={getOptionLabel(value)} size="small" />)
                        : <Chip label={getOptionLabel(selected)} size="small" />}
                    </Box>
                  );
                }

                return Array.isArray(selected)
                  ? selected.map(getOptionLabel).join(", ")
                  : getOptionLabel(selected);
              }}
              {...field}
              value={field.value ?? (model.multiple ? [] : "")}
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
                ? finalOptions.map((option) => {
                  const selected: boolean = model.multiple && Array.isArray(field.value) ? field.value.includes(option.value) : field.value === option.value;
                  const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                  return (
                    <MenuItem key={option.key} value={option.value}>
                      <SelectionIcon fontSize="small" style={{ marginRight: 8, padding: 9, boxSizing: "content-box" }} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  );
                })
                : finalOptions.map((option) => (
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
    const finalOptions = options || model.options;
    const stringToValueConverter = model.stringToValueConverter || ((str: string) => undefined);

    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <Autocomplete
            fullWidth
            options={finalOptions}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            getOptionKey={(option) => (typeof option === "string" ? "" : option.key)}
            disabled={model.disabled}
            readOnly={model.readOnly || formLoading}
            multiple={model.multiple}
            freeSolo={model.freeSolo}
            filterOptions={model.searchAsYouType ? (options) => options : undefined}
            autoComplete={model.searchAsYouType}
            includeInputInList={model.searchAsYouType}
            noOptionsText={t("empty")}
            onInputChange={autocompleteOnInputChange}
            {...field}
            renderOption={autocompleteRenderOption}
            renderInput={autocompleteRenderInput || ((params) => (
              <TextField
                {...params}
                required={model.required}
                label={finalLabel}
                placeholder={model.placeholder}
                margin="normal"
                error={fieldState.invalid}
                helperText={fieldState.error && fieldState.error.message}
                type="text"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: startAdornment
                      ? (
                        <InputAdornment position="start">
                          {startAdornment}
                        </InputAdornment>
                      )
                      : params.InputProps.startAdornment,
                    endAdornment: (
                      <>
                        {
                          endAdornment
                            ? (
                              <InputAdornment position="end">
                                {endAdornment}
                              </InputAdornment>
                            )
                            : autocompleteLoading
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
            // Convert valueType -> optionType for Autocomplete
            value={model.multiple && Array.isArray(field.value)
              ? finalOptions.filter((option) => field.value.includes(option.value))
              : finalOptions.find((option) => option.value === field.value) || null}
            // Convert optionType -> valueType for React Hook Form
            onChange={
              (event, value, _reason, _details) => {
                if (typeof value === "string") {
                  field.onChange(event, stringToValueConverter(value));
                } else if (Array.isArray(value)) {
                  field.onChange(event, value.map((v) => (typeof v === "string" ? stringToValueConverter(v) : v.value)));
                } else {
                  field.onChange(event, value ? value.value : undefined);
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
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.disabled || field.disabled}>
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
                checked={!!field.value}
                readOnly={model.readOnly || formLoading}
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
              label={finalLabel}
            />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  if (model.inputType === "radio") {
    const finalOptions = options || model.options;

    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <FormControl
            fullWidth
            required={model.required}
            margin="normal"
            error={fieldState.invalid}
            disabled={model.disabled || field.disabled}>
            <FormLabel>{finalLabel}</FormLabel>
            <RadioGroup
              {...field}
              value={field.value ?? ""}
              row={model.row}
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
              {finalOptions.map((option) => (
                <FormControlLabel
                  key={option.key}
                  value={option.value}
                  control={<Radio readOnly={model.readOnly || formLoading} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  if (model.inputType === "file") {
    const formRegisterReturn = formContext.register(model.name, {
      ...model.rules,
      ...rules,
    });

    return (
      <FormControl
        fullWidth
        required={model.required}
        margin="normal"
        error={model.name in formContext.formState.errors}
        disabled={model.disabled || formRegisterReturn.disabled}
      >
        <FormLabel>{finalLabel}</FormLabel>
        <FileInput
          disabled={model.disabled || formRegisterReturn.disabled}
          readonly={model.readOnly || formLoading}
          inputProps={{
            ...formRegisterReturn,
            multiple: model.multiple,
            required: model.required,
            accept: model.accept,
            onChange: model.validateOnChange
              ? (event) => {
                formRegisterReturn.onChange(event);
                // trigger validation
                formContext.trigger(model.name);
              }
              : formRegisterReturn.onChange,
          }}
          error={formContext.formState.errors[model.name]?.message as string}
        />
      </FormControl>
    );
  }

  if (model.inputType === "date") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => {
          const onChange = (newValue: Dayjs | null) => {
            field.onChange(formatDateTimeValue(newValue, "date"));
            if (model.validateOnChange) {
              formContext.trigger(model.name);
            }
          };

          return (
            <DatePicker
              name={field.name}
              label={finalLabel}
              disabled={model.disabled || field.disabled}
              readOnly={model.readOnly || formLoading}
              value={parseDateTimeValue(field.value, "date")}
              minDate={parseDateTimeValue(model.min, "date") ?? undefined}
              maxDate={parseDateTimeValue(model.max, "date") ?? undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: model.required,
                  margin: "normal",
                  error: fieldState.invalid,
                  helperText: fieldState.error?.message,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              onChange={onChange}
            />
          );
        }}
      />
    );
  }

  if (model.inputType === "time") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => {
          const onChange = (newValue: Dayjs | null) => {
            field.onChange(formatDateTimeValue(newValue, "time"));
            if (model.validateOnChange) {
              formContext.trigger(model.name);
            }
          };

          return (
            <TimePicker
              name={field.name}
              label={finalLabel}
              disabled={model.disabled || field.disabled}
              readOnly={model.readOnly || formLoading}
              value={parseDateTimeValue(field.value, "time")}
              minTime={parseDateTimeValue(model.min, "time") ?? undefined}
              maxTime={parseDateTimeValue(model.max, "time") ?? undefined}
              minutesStep={model.minutesStep}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: model.required,
                  margin: "normal",
                  error: fieldState.invalid,
                  helperText: fieldState.error?.message,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              onChange={onChange}
            />
          );
        }}
      />
    );
  }

  if (model.inputType === "datetime") {
    return (
      <Controller
        control={formContext.control}
        name={model.name}
        rules={{
          ...model.rules,
          ...rules,
        }}
        render={({ field, fieldState }) => {
          const onChange = (newValue: Dayjs | null) => {
            field.onChange(formatDateTimeValue(newValue, "datetime"));
            if (model.validateOnChange) {
              formContext.trigger(model.name);
            }
          };

          return (
            <DateTimePicker
              name={field.name}
              label={finalLabel}
              disabled={model.disabled || field.disabled}
              readOnly={model.readOnly || formLoading}
              value={parseDateTimeValue(field.value, "datetime")}
              minDateTime={parseDateTimeValue(model.min, "datetime") ?? undefined}
              maxDateTime={parseDateTimeValue(model.max, "datetime") ?? undefined}
              minutesStep={model.minutesStep}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: model.required,
                  margin: "normal",
                  error: fieldState.invalid,
                  helperText: fieldState.error?.message,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              onChange={onChange}
            />
          );
        }}
      />
    );
  }

  if (model.inputType === "array") {
    return (
      <DynamicArrayInput
        model={model}
        formContext={formContext}
        formLoading={formLoading}
        label={label}
        hiddenMap={hiddenMap}
        startAdornmentMap={startAdornmentMap}
        endAdornmentMap={endAdornmentMap}
        labelMap={labelMap}
        rulesMap={rulesMap}
        optionsMap={optionsMap}
        autocompleteRenderInputMap={autocompleteRenderInputMap}
        autocompleteRenderOptionMap={autocompleteRenderOptionMap}
        autocompleteOnInputChangeMap={autocompleteOnInputChangeMap}
        autocompleteLoadingMap={autocompleteLoadingMap}
      />
    );
  }
}

export default DynamicInput;
