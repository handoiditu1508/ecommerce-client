import { ArrayItemType } from "@/common/typeHelpers";
import { Property } from "csstype";
import { Path, PathValue, RegisterOptions } from "react-hook-form";

export type DynamicInputModel<T extends Record<string, any>, K extends Path<T>> =
  | DynamicTextInputModel<T, K>
  | DynamicSelectInputModel<T, K>
  | DynamicAutoCompleteInputModel<T, K>
  | DynamicCheckboxInputModel<T, K>
  | DynamicRadioInputModel<T, K>;

type DynamicCommonInputModel<T extends Record<string, any>, K extends Path<T>> = {
  name: K;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  hidden?: boolean | ((data: T) => boolean);
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
  options: DynamicInputOption<T, K>[];
};

export type DynamicInputOption<T extends Record<string, any>, K extends Path<T>> = {
  key: string | number;
  label: string;
  value: ArrayItemType<PathValue<T, K>>;
};

export type DynamicAutoCompleteInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "autocomplete";
  placeholder?: string;
  multiple?: boolean;
  options: DynamicInputOption<T, K>[];
  freeSolo?: boolean;
  searchAsYouType?: boolean;
  // required for freeSolo autocomplete to convert string input to the correct value type
  stringToValueConverter?: (str: string) => ArrayItemType<PathValue<T, K>> | undefined;
};

export type DynamicCheckboxInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "checkbox";
};

export type DynamicRadioInputModel<T extends Record<string, any>, K extends Path<T>> = DynamicCommonInputModel<T, K> & {
  inputType: "radio";
  options: DynamicInputOption<T, K>[];
  row?: boolean;
};

export type DynamicFormModel<T extends Record<string, any>> = {
  inputs: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
  submitButtonText: string;
  postActionInputs?: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
};
