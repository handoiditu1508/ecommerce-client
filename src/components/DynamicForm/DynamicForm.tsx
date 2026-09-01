import CONFIG from "@/configs";
import { AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { FieldValues, Path, RegisterOptions, SubmitHandler, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ImagePickerRenderProps, RichTextEditorHandle } from "../RichTextEditor";
import DynamicInput from "./DynamicInput";
import { DynamicArrayItemAction, DynamicFormModel, DynamicInputOption } from "./models";

export type DynamicFormProps<T extends FieldValues> = Omit<BoxProps<"form">, "component" | "children" | "onSubmit"> & {
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
  autocompleteOnInputChangeMap?: Partial<Record<
    Path<T>,
    (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void
  >>;
  autocompleteLoadingMap?: Partial<Record<Path<T>, boolean>>;
  hiddenMap?: Partial<Record<Path<T>, boolean | ((data: T) => boolean)>>;
  richTextRefMap?: Partial<Record<Path<T>, React.Ref<RichTextEditorHandle>>>;
  richTextImagePickerMap?: Partial<Record<Path<T>, (props: ImagePickerRenderProps) => React.ReactNode>>;
  renderInputMap?: Partial<Record<Path<T>, React.ReactNode>>;
  arrayItemActionsMap?: Partial<Record<Path<T>, DynamicArrayItemAction<T>[]>>;
  onSubmit: SubmitHandler<T>;
};

function DynamicForm<T extends FieldValues>({
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
  richTextRefMap = CONFIG.EMPTY_OBJECT,
  richTextImagePickerMap = CONFIG.EMPTY_OBJECT,
  renderInputMap = CONFIG.EMPTY_OBJECT,
  arrayItemActionsMap = CONFIG.EMPTY_OBJECT,
  onSubmit,
  ...props
}: DynamicFormProps<T>) {
  const { t } = useTranslation();
  const renderInputs = (inputs: DynamicFormModel<T>["inputs"]) => inputs.map((inputModel) => (
    <React.Fragment key={inputModel.name}>
      {renderInputMap[inputModel.name] ?? (
        <DynamicInput
          model={inputModel}
          formContext={formContext}
          formLoading={loading}
          hidden={hiddenMap[inputModel.name]}
          richTextRef={richTextRefMap[inputModel.name]}
          richTextImagePicker={richTextImagePickerMap[inputModel.name]}
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
          renderInputMap={renderInputMap}
          arrayItemActionsMap={arrayItemActionsMap}
        />
      )}
    </React.Fragment>
  ));

  return (
    <Box component="form" onSubmit={formContext.handleSubmit(onSubmit)} {...props}>
      {renderInputs(model.inputs)}
      {model.submitButtonText && (
        <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>
          {t(model.submitButtonText)}
        </Button>
      )}
      {model.postActionInputs && renderInputs(model.postActionInputs)}
    </Box>
  );
}

export default DynamicForm;
