import { Property } from "csstype";
import { Path, RegisterOptions } from "react-hook-form";

export type DynamicInputModel<T extends Record<string, any>, K extends Path<T>> = {
  name: K;
  inputType: "text" | "email" | "password" | "checkbox" | "hidden";
  label?: string;
  required?: boolean;
  readonly?: boolean;
  rules?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  placeholder?: string;
  textAlign?: Property.TextAlign;
  maxLength?: number;
  minLength?: number;
  validateOnChange?: boolean;
};

export type DynamicFormModel<T extends Record<string, any>> = {
  inputs: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
  submitButtonText: string;
};
