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
      unmask={true}
      radix=","
      mapToRadix={["."]}
      scale={2}
      thousandsSeparator="."
      min={0}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { value } })}
    />
  );
}

export default CurrencyMaskInput;
