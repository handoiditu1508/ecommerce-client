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
  overwriteStartAdornments?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteEndAdornments?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteLabels?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteRules?: { [K in Path<T>]?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> };
  overwriteOptions?: { [K in Path<T>]?: DynamicInputOption<T, K>[] };
  overwriteAutocompleteRenderInputs?: Partial<Record<Path<T>, (params: AutocompleteRenderInputParams) => React.ReactNode>>;
  overwriteAutocompleteRenderOptions?: { [K in Path<T>]?: AutocompleteProps<DynamicInputOption<T, K>, boolean | undefined, boolean, boolean, "div">["renderOption"] };
  overwriteOnInputChange?: Partial<Record<Path<T>, (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void>>;
  overwriteLoading?: Partial<Record<Path<T>, boolean>>;
  onSubmit: SubmitHandler<T>;
};

function DynamicForm<T extends Record<string, any>>({
  model,
  formContext,
  loading = false,
  overwriteStartAdornments = CONFIG.EMPTY_OBJECT,
  overwriteEndAdornments = CONFIG.EMPTY_OBJECT,
  overwriteLabels = CONFIG.EMPTY_OBJECT,
  overwriteRules = CONFIG.EMPTY_OBJECT,
  overwriteOptions = CONFIG.EMPTY_OBJECT,
  overwriteAutocompleteRenderInputs = CONFIG.EMPTY_OBJECT,
  overwriteAutocompleteRenderOptions = CONFIG.EMPTY_OBJECT,
  overwriteOnInputChange = CONFIG.EMPTY_OBJECT,
  overwriteLoading = CONFIG.EMPTY_OBJECT,
  onSubmit = CONFIG.EMPTY_FUNCTION,
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
          overwriteStartAdornment={overwriteStartAdornments[inputModel.name]}
          overwriteEndAdornment={overwriteEndAdornments[inputModel.name]}
          overwriteLabel={overwriteLabels[inputModel.name]}
          overwriteRules={overwriteRules[inputModel.name]}
          overwriteOptions={overwriteOptions[inputModel.name]}
          overwriteAutocompleteRenderInput={overwriteAutocompleteRenderInputs[inputModel.name]}
          overwriteAutocompleteRenderOption={overwriteAutocompleteRenderOptions[inputModel.name]}
          overwriteOnInputChange={overwriteOnInputChange[inputModel.name]}
          overwriteLoading={overwriteLoading[inputModel.name]}
        />
      ))}
      <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>{model.submitButtonText}</Button>
    </Box>
  );
}

export default DynamicForm;
