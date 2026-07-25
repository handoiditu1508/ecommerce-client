import CONFIG from "@/configs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid, { GridProps } from "@mui/material/Grid";
import { DynamicFormProps } from "./DynamicForm";
import DynamicInput from "./DynamicInput";

export type DynamicGridFormProps<T extends Record<string, any>> = DynamicFormProps<T> & {
  gridProps?: Omit<GridProps, "children" | "container">;
};

function DynamicGridForm<T extends Record<string, any>>({
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
  gridProps,
  ...props
}: DynamicGridFormProps<T>) {
  const data = formContext.watch();

  const renderInputs = (inputs: DynamicFormProps<T>["model"]["inputs"]) => (
    <Grid container {...gridProps}>
      {inputs.map((inputModel) => {
        const hidden = hiddenMap[inputModel.name] ?? inputModel.hidden;
        const isHidden = typeof hidden === "function" ? hidden(data) : hidden;

        if (isHidden) return null;

        return (
          <Grid key={inputModel.name} size={inputModel.size ?? 12}>
            <DynamicInput
              model={inputModel}
              formContext={formContext}
              formLoading={loading}
              hidden={hiddenMap[inputModel.name]}
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
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box component="form" onSubmit={formContext.handleSubmit(onSubmit)} {...props}>
      {renderInputs(model.inputs)}
      {model.submitButtonText && <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" loading={loading}>{model.submitButtonText}</Button>}
      {model.postActionInputs && renderInputs(model.postActionInputs)}
    </Box>
  );
}

export default DynamicGridForm;
