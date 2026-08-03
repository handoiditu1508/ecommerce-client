import InputAdornment from "@mui/material/InputAdornment";
import { InputBaseComponentProps } from "@mui/material/InputBase";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";
import CurrencyMaskInput from "./CurrencyMaskInput";

export type CurrencyInputProps = Omit<TextFieldProps, "onChange" | "value"> & {
  value?: number;
  currencySymbol?: React.ReactNode;
  onValueChange?: (value: number | undefined) => void;
};

function CurrencyInput({
  value,
  currencySymbol = "₫",
  onValueChange,
  slotProps,
  ...props
}: CurrencyInputProps) {
  return (
    <TextField
      {...props}
      value={value?.toString() ?? ""}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          inputComponent: CurrencyMaskInput as unknown as React.ElementType<InputBaseComponentProps>,
          endAdornment: currencySymbol
            ? <InputAdornment position="end">{currencySymbol}</InputAdornment>
            : undefined,
        },
      }}
      onChange={(event) => onValueChange?.(
        event.target.value === "" ? undefined : Number(event.target.value),
      )}
    />
  );
}

export default CurrencyInput;
