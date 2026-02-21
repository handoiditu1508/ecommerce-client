import CONFIG from "@/configs";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Path, RegisterOptions, SubmitHandler, UseFormReturn } from "react-hook-form";
import DynamicInput from "./DynamicInput";
import { DynamicFormModel } from "./models";

type DynamicFormProps<T extends Record<string, any>> = Omit<BoxProps<"form">, "component" | "children" | "onSubmit"> & {
  model: DynamicFormModel<T>;
  formContext: UseFormReturn<T>;
  loading?: boolean;
  overwriteStartAdornments?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteEndAdornments?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteLabels?: Partial<Record<Path<T>, React.ReactNode>>;
  overwriteRules?: { [K in Path<T>]?: Omit<RegisterOptions<T, K>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> };
  onSubmit: SubmitHandler<T>;
};

function DynamicForm<T extends Record<string, any>>({
  model,
  formContext,
  loading = false,
  overwriteStartAdornments = {},
  overwriteEndAdornments = {},
  overwriteLabels = {},
  overwriteRules = {},
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
          loading={loading}
          overwriteStartAdornment={overwriteStartAdornments[inputModel.name]}
          overwriteEndAdornment={overwriteEndAdornments[inputModel.name]}
          overwriteLabel={overwriteLabels[inputModel.name]}
          overwriteRules={overwriteRules[inputModel.name]}
        />
      ))}
      <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>{model.submitButtonText}</Button>
    </Box>
  );
}

export default DynamicForm;
