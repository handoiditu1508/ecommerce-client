import CONFIG from "@/configs";
import { AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Path, RegisterOptions, SubmitHandler, UseFormReturn } from "react-hook-form";
import DynamicInput from "./DynamicInput";
import { DynamicFormModel, DynamicInputOption } from "./models";

export type DynamicFormProps<T extends Record<string, any>> = Omit<BoxProps<"form">, "component" | "children" | "onSubmit"> & {
  model: DynamicFormModel<T>;
  formContext: UseFormReturn<T>;
  loading?: boolean;
  startAdornmentMap?: Partial<Record<Path<T>, React.ReactNode>>;
  endAdornmentMap?: Partial<Record<Path<T>, React.ReactNode>>;
  labelMap?: Partial<Record<Path<T>, React.ReactNode>>;
  rulesMap?: { [K in Path<T>]?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> };
  optionsMap?: { [K in Path<T>]?: DynamicInputOption<T, K>[] };
  autocompleteRenderInputMap?: Partial<Record<Path<T>, (params: AutocompleteRenderInputParams) => React.ReactNode>>;
  autocompleteRenderOptionMap?: { [K in Path<T>]?: AutocompleteProps<DynamicInputOption<T, K>, boolean | undefined, boolean, boolean, "div">["renderOption"] };
  autocompleteOnInputChangeMap?: Partial<Record<Path<T>, (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void>>;
  autocompleteLoadingMap?: Partial<Record<Path<T>, boolean>>;
  hiddenMap?: Partial<Record<Path<T>, boolean | ((data: T) => boolean)>>;
  onSubmit: SubmitHandler<T>;
};

function DynamicForm<T extends Record<string, any>>({
  model,
  formContext,
  loading = false,
  startAdornmentMap = CONFIG.EMPTY_OBJECT,
  endAdornmentMap = CONFIG.EMPTY_OBJECT,
  labelMap = CONFIG.EMPTY_OBJECT,
  rulesMap = CONFIG.EMPTY_OBJECT,
  optionsMap = CONFIG.EMPTY_OBJECT,
  autocompleteRenderInputMap = CONFIG.EMPTY_OBJECT,
  autocompleteRenderOptionMap = CONFIG.EMPTY_OBJECT,
  autocompleteOnInputChangeMap = CONFIG.EMPTY_OBJECT,
  autocompleteLoadingMap = CONFIG.EMPTY_OBJECT,
  hiddenMap = CONFIG.EMPTY_OBJECT,
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
          startAdornment={startAdornmentMap[inputModel.name]}
          endAdornment={endAdornmentMap[inputModel.name]}
          label={labelMap[inputModel.name]}
          rules={rulesMap[inputModel.name]}
          options={optionsMap[inputModel.name]}
          autocompleteRenderInput={autocompleteRenderInputMap[inputModel.name]}
          autocompleteRenderOption={autocompleteRenderOptionMap[inputModel.name]}
          autocompleteOnInputChange={autocompleteOnInputChangeMap[inputModel.name]}
          autocompleteLoading={autocompleteLoadingMap[inputModel.name]}
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
      ))}
      {model.submitButtonText && <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>{model.submitButtonText}</Button>}
      {model.postActionInputs && model.postActionInputs.map((inputModel) => (
        <DynamicInput
          key={inputModel.name}
          model={inputModel}
          formContext={formContext}
          formLoading={loading}
          startAdornment={startAdornmentMap[inputModel.name]}
          endAdornment={endAdornmentMap[inputModel.name]}
          label={labelMap[inputModel.name]}
          rules={rulesMap[inputModel.name]}
          options={optionsMap[inputModel.name]}
          autocompleteRenderInput={autocompleteRenderInputMap[inputModel.name]}
          autocompleteRenderOption={autocompleteRenderOptionMap[inputModel.name]}
          autocompleteOnInputChange={autocompleteOnInputChangeMap[inputModel.name]}
          autocompleteLoading={autocompleteLoadingMap[inputModel.name]}
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
      ))}
    </Box>
  );
}

export default DynamicForm;
