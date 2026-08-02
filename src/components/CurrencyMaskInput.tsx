import { IMaskInput } from "react-imask";
import React from "react";

export type CurrencyMaskInputProps = {
  onChange: (event: { target: { value: string; }; }) => void;
  ref?: React.Ref<HTMLInputElement>;
};

function CurrencyMaskInput({ onChange, ref, ...props }: CurrencyMaskInputProps) {
  return (
    <IMaskInput
      {...props}
      mask={Number}
      thousandsSeparator="."
      min={0}
      inputRef={ref}
      onAccept={(_value, mask) => onChange({ target: { value: mask.unmaskedValue } })}
    />
  );
}

export default CurrencyMaskInput;
