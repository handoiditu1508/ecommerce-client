import { ArrayItemType } from "@/common/type";
import { GridProps } from "@mui/material/Grid";
import { Property } from "csstype";
import { FieldValues, Path, PathValue, RegisterOptions, Validate } from "react-hook-form";

export type DynamicInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  | DynamicTextInputModel<T, K, A>
  | DynamicColorInputModel<T, K, A>
  | DynamicCurrencyInputModel<T, K, A>
  | DynamicDateTimeInputModel<T, K, A>
  | DynamicSelectInputModel<T, K, A>
  | DynamicAutoCompleteInputModel<T, K, A>
  | DynamicCheckboxInputModel<T, K, A>
  | DynamicRadioInputModel<T, K, A>
  | DynamicFileInputModel<T, K, A>
  | DynamicArrayInputModel<T, K, A>;

type DynamicRules<T extends FieldValues, K extends Path<T>, A extends FieldValues> =
  Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled" | "validate"> & {
    validate?: Validate<PathValue<T, K>, A> | Record<string, Validate<PathValue<T, K>, A>>;
  };

type DynamicCommonInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues> = {
  name: K;
  size?: GridProps["size"];
  label?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hidden?: boolean | ((data: T) => boolean);
  rules?: DynamicRules<T, K, A>;
  validateOnChange?: boolean;
};

export type DynamicTextInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "text" | "email" | "password";
    placeholder?: string;
    textAlign?: Property.TextAlign;
    maxLength?: number;
    minLength?: number;
  };

export type DynamicColorInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "color";
  };

export type DynamicCurrencyInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "currency";
    currencySymbol?: string;
  };

export type DynamicDateTimeInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "date" | "time" | "datetime";
    min?: string;
    max?: string;
    minutesStep?: number;
  };

export type DynamicSelectInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "select";
    placeholder?: string;
    showCheckbox?: boolean;
    showSelectedAsChips?: boolean;
    multiple?: boolean;
    options: DynamicInputOption<T, K>[];
  };

export type DynamicInputOption<T extends FieldValues, K extends Path<T>> = {
  key: string | number;
  label: string;
  value: ArrayItemType<PathValue<T, K>>;
  icon?: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
  avatar?: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
};

export type DynamicArrayItemAction<T extends FieldValues> = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean | ((data: T, index: number) => boolean);
  hidden?: boolean | ((data: T, index: number) => boolean);
  onClick: (data: T, index: number) => void;
};

export type DynamicAutoCompleteInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "autocomplete";
    placeholder?: string;
    multiple?: boolean;
    options: DynamicInputOption<T, K>[];
    freeSolo?: boolean;
    searchAsYouType?: boolean;
    // required for freeSolo autocomplete to convert string input to the correct value type
    stringToValueConverter?: (str: string) => ArrayItemType<PathValue<T, K>> | undefined;
  };

export type DynamicCheckboxInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "checkbox";
  };

export type DynamicRadioInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "radio";
    options: DynamicInputOption<T, K>[];
    row?: boolean;
  };

export type DynamicFileInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  PathValue<T, K> extends FileList | null | undefined
    ? (
      DynamicCommonInputModel<T, K, A> & {
        inputType: "file";
        multiple?: boolean;
        accept?: string;
      }
    )
    : never;

export type DynamicArrayObjectInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "array";
    itemInputs: DynamicInputModel<
      ArrayItemType<PathValue<T, K>>,
      Path<ArrayItemType<PathValue<T, K>>>,
      A
    >[];
    addButtonText?: string;
    removeButtonText?: string;
    createDefaultValue: (data: T) => ArrayItemType<PathValue<T, K>>;
  };

export type DynamicArrayPrimitiveInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  DynamicCommonInputModel<T, K, A> & {
    inputType: "array";
    itemInput: Omit<
      DynamicInputModel<ArrayItemType<PathValue<T, K>>, Path<ArrayItemType<PathValue<T, K>>>, A>,
      "name"
    >;
    addButtonText?: string;
    removeButtonText?: string;
    createDefaultValue: (data: T) => ArrayItemType<PathValue<T, K>>;
  };

export type DynamicArrayInputModel<T extends FieldValues, K extends Path<T>, A extends FieldValues = T> =
  | DynamicArrayObjectInputModel<T, K, A>
  | DynamicArrayPrimitiveInputModel<T, K, A>;

export type DynamicFormModel<T extends FieldValues> = {
  inputs: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
  submitButtonText?: string;
  postActionInputs?: {
    [K in Path<T>]: DynamicInputModel<T, K>
  }[Path<T>][];
};
