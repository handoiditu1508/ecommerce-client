import CONFIG from "@/configs";
import { AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Path, RegisterOptions, SubmitHandler, UseFormReturn } from "react-hook-form";
import DynamicInput from "./DynamicInput";
import { DynamicFormModel, DynamicInputOption } from "./models";

type DynamicFormProps<T extends Record<string, any>> = Omit<BoxProps<"form">, "component" | "children" | "onSubmit"> & {
  model: DynamicFormModel<T>;
  formContext: UseFormReturn<T>;
  loading?: boolean;
  overwriteStartAdornment?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteEndAdornment?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteLabel?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteRules?: { [K in Path<T>]?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> };
  overwriteOptions?: { [K in Path<T>]?: DynamicInputOption<T, K>[] };
  overwriteAutocompleteRenderInput?: Partial<Record<Path<T>, (params: AutocompleteRenderInputParams) => React.ReactNode>>;
  overwriteAutocompleteRenderOption?: { [K in Path<T>]?: AutocompleteProps<DynamicInputOption<T, K>, boolean | undefined, boolean, boolean, "div">["renderOption"] };
  overwriteAutocompleteOnInputChange?: Partial<Record<Path<T>, (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void>>;
  overwriteLoading?: Partial<Record<Path<T>, boolean>>;
  onSubmit: SubmitHandler<T>;
};

function DynamicForm<T extends Record<string, any>>({
  model,
  formContext,
  loading = false,
  overwriteStartAdornment = CONFIG.EMPTY_OBJECT,
  overwriteEndAdornment = CONFIG.EMPTY_OBJECT,
  overwriteLabel = CONFIG.EMPTY_OBJECT,
  overwriteRules = CONFIG.EMPTY_OBJECT,
  overwriteOptions = CONFIG.EMPTY_OBJECT,
  overwriteAutocompleteRenderInput = CONFIG.EMPTY_OBJECT,
  overwriteAutocompleteRenderOption = CONFIG.EMPTY_OBJECT,
  overwriteAutocompleteOnInputChange = CONFIG.EMPTY_OBJECT,
  overwriteLoading = CONFIG.EMPTY_OBJECT,
  onSubmit,
  ...props
}: DynamicFormProps<T>) {
  return (
    <Box component="form" onSubmit={formContext.handleSubmit(onSubmit)} {...props}>
      {model.inputs.map((inputModel) => (
        <DynamicInput
          key={inputModel.name}
          model={inputModel}
          formContext={formContext}
          formLoading={loading}
          overwriteStartAdornment={overwriteStartAdornment[inputModel.name]}
          overwriteEndAdornment={overwriteEndAdornment[inputModel.name]}
          overwriteLabel={overwriteLabel[inputModel.name]}
          overwriteRules={overwriteRules[inputModel.name]}
          overwriteOptions={overwriteOptions[inputModel.name]}
          overwriteAutocompleteRenderInput={overwriteAutocompleteRenderInput[inputModel.name]}
          overwriteAutocompleteRenderOption={overwriteAutocompleteRenderOption[inputModel.name]}
          overwriteAutocompleteOnInputChange={overwriteAutocompleteOnInputChange[inputModel.name]}
          overwriteLoading={overwriteLoading[inputModel.name]}
        />
      ))}
      <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>{model.submitButtonText}</Button>
      {model.postActionInputs && model.postActionInputs.map((inputModel) => (
        <DynamicInput
          key={inputModel.name}
          model={inputModel}
          formContext={formContext}
          formLoading={loading}
          overwriteStartAdornment={overwriteStartAdornment[inputModel.name]}
          overwriteEndAdornment={overwriteEndAdornment[inputModel.name]}
          overwriteLabel={overwriteLabel[inputModel.name]}
          overwriteRules={overwriteRules[inputModel.name]}
          overwriteOptions={overwriteOptions[inputModel.name]}
          overwriteAutocompleteRenderInput={overwriteAutocompleteRenderInput[inputModel.name]}
          overwriteAutocompleteRenderOption={overwriteAutocompleteRenderOption[inputModel.name]}
          overwriteAutocompleteOnInputChange={overwriteAutocompleteOnInputChange[inputModel.name]}
          overwriteLoading={overwriteLoading[inputModel.name]}
        />
      ))}
    </Box>
  );
}

export default DynamicForm;
