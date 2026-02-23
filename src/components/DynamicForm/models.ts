import { ArrayItemType } from "@/common/typeHelpers";
import { Property } from "csstype";
import React from "react";
import { Path, PathValue, RegisterOptions } from "react-hook-form";

export type DynamicInputModel<T extends Record<string, any>, K extends Path<T>> =
  | DynamicTextInputModel<T, K>
  | DynamicSelectInputModel<T, K>
  | DynamicCheckboxInputModel<T, K>
  | DynamicHiddenInputModel<T, K>;

type DynamicCommonInputModel<T extends Record<string, any>, K extends Path<T>> = {
  name: K;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  rules?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  validateOnChange?: boolean;
};

export type DynamicTextInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "text" | "email" | "password";
  placeholder?: string;
  textAlign?: Property.TextAlign;
  maxLength?: number;
  minLength?: number;
};

export type DynamicSelectInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "select";
  placeholder?: string;
  showCheckbox?: boolean;
  showSelectedAsChips?: boolean;
  multiple?: boolean;
  options: DynamicSelectInputOption<T, K>[];
};

export type DynamicSelectInputOption<T extends Record<string, any>, K extends Path<T>> = {
  key: React.Key;
  label: string;
  value: ArrayItemType<PathValue<T, K>>;
};


export type DynamicCheckboxInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "checkbox";
};

export type DynamicHiddenInputModel<T extends Record<string, any>, K extends Path<T>> = {
  name: K;
  inputType: "hidden";
  required?: boolean;
  rules?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
};

export type DynamicFormModel<T extends Record<string, any>> = {
  inputs: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
  submitButtonText: string;
};
