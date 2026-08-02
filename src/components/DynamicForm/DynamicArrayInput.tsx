import CONFIG from "@/configs";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ArrayPath, Path, UseFormReturn, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DynamicFormProps } from "./DynamicForm";
import DynamicInput from "./DynamicInput";
import { DynamicArrayInputModel, DynamicInputModel } from "./models";

export type DynamicArrayInputProps<T extends Record<string, any>, K extends Path<T>> = {
  model: DynamicArrayInputModel<T, K>;
  formContext: UseFormReturn<T>;
  formLoading?: boolean;
  label?: React.ReactNode;

  // these props come from DynamicForm
  startAdornmentMap?: DynamicFormProps<T>["startAdornmentMap"];
  endAdornmentMap?: DynamicFormProps<T>["endAdornmentMap"];
  labelMap?: DynamicFormProps<T>["labelMap"];
  rulesMap?: DynamicFormProps<T>["rulesMap"];
  optionsMap?: DynamicFormProps<T>["optionsMap"];
  autocompleteRenderInputMap?: DynamicFormProps<T>["autocompleteRenderInputMap"];
  autocompleteRenderOptionMap?: DynamicFormProps<T>["autocompleteRenderOptionMap"];
  autocompleteOnInputChangeMap?: DynamicFormProps<T>["autocompleteOnInputChangeMap"];
  autocompleteLoadingMap?: DynamicFormProps<T>["autocompleteLoadingMap"];
  hiddenMap?: DynamicFormProps<T>["hiddenMap"];
};

/**
 * Get value for specific item in field array.
 * @param map A dictionary of string key and any value type.
 * @param path String path to the specific item in form data.
 * @returns The value in map corresponse to path.
 * @example
 * ```
 * type FormData = {
 *   names: string[];
 *   fullNames: {
 *     firstName: string;
 *   };
 * };
 *
 * const path1 = "names.0"; // path to first item (index 0) in names property
 * const path2 = "names.-1"; // wild card path reference all items in names property
 * const path3 = "fullNames.1.firstName"; // path to second firstName (index 1) in fullNames property
 * const path4 = "fullNames.-1.firstName"; // wild card path reference all firstNames in fullNames property
 * ```
 */
const getFinalValue = <T extends Record<string, any>, V>(map: Partial<Record<Path<T>, V>>, path: Path<T>): V | undefined => {
  let finalValue: V | undefined = map[path];
  if (finalValue === undefined) {
    const wildcardPath = path.replace(/\.[0-9]+(?=\.|$)/g, ".-1") as Path<T>;
    finalValue = map[wildcardPath];
  }

  return finalValue;
};

function DynamicArrayInput<T extends Record<string, any>, K extends Path<T>>({
  model,
  formContext,
  formLoading = false,
  label,
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
}: DynamicArrayInputProps<T, K>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray<T, ArrayPath<T>>({
    control: formContext.control,
    name: model.name as ArrayPath<T>, // lie to type checking that this is ArrayPath<T>
  });
  const finalLabel = label || model.label;

  const addItem = () => {
    const data = formContext.getValues();
    const defaultItem = model.createDefaultValue(data);
    append(defaultItem);
  };

  return (
    <FormControl
      component="fieldset"
      fullWidth
      required={model.required}
      margin="normal"
      disabled={model.disabled}
      sx={{
        border: theme.border.smallBorder,
        borderRadius: (theme.shape.borderRadius as number) * 0.5,
        px: 2,
        pb: 2,
        boxSizing: "border-box",
      }}>
      {finalLabel && <FormLabel component="legend">{finalLabel}</FormLabel>}
      <FormGroup>
        {fields.map((field, index, fieldsArray) => (
          <React.Fragment key={field.id}>
            {index === 0 && (!model.required || fieldsArray.length > 1) && <Divider variant="inset" sx={{ mr: -2 }} textAlign="right">
              <Button
                variant="text"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={model.disabled || model.readOnly || formLoading}
                onClick={() => remove(index)}>
                {model.removeButtonText ? t(model.removeButtonText) : t("remove")} #{index + 1}
              </Button>
            </Divider>}

            {index !== 0 && <Divider sx={{ mx: -2, mt: 2 }} textAlign="right">
              <Button
                variant="text"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={model.disabled || model.readOnly || formLoading}
                onClick={() => remove(index)}>
                {model.removeButtonText ? t(model.removeButtonText) : t("remove")} #{index + 1}
              </Button>
            </Divider>}

            {"itemInputs" in model && model.itemInputs.map((itemInput) => {
              const pathName = `${model.name}.${index}.${itemInput.name}` as K;

              return (
                <DynamicInput
                  key={itemInput.name}
                  model={{
                    ...itemInput,
                    name: pathName,
                  } as DynamicInputModel<T, K>}
                  formContext={formContext}
                  formLoading={formLoading}
                  startAdornment={getFinalValue(startAdornmentMap, pathName)}
                  endAdornment={getFinalValue(endAdornmentMap, pathName)}
                  label={getFinalValue(labelMap, pathName)}
                  rules={getFinalValue(rulesMap as Partial<Record<Path<T>, any>>, pathName)}
                  options={getFinalValue(optionsMap as Partial<Record<Path<T>, any>>, pathName)}
                  autocompleteRenderInput={getFinalValue(autocompleteRenderInputMap, pathName)}
                  autocompleteRenderOption={getFinalValue(autocompleteRenderOptionMap as Partial<Record<Path<T>, any>>, pathName)}
                  autocompleteOnInputChange={getFinalValue(autocompleteOnInputChangeMap, pathName)}
                  autocompleteLoading={getFinalValue(autocompleteLoadingMap, pathName)}
                  hidden={getFinalValue(hiddenMap, pathName)}
                />
              );
            })}

            {"itemInput" in model && (() => {
              const pathName = `${model.name}.${index}` as K;

              return (
                <DynamicInput
                  model={{
                    ...model.itemInput,
                    name: pathName,
                  } as DynamicInputModel<T, K>}
                  formContext={formContext}
                  formLoading={formLoading}
                  startAdornment={getFinalValue(startAdornmentMap, pathName)}
                  endAdornment={getFinalValue(endAdornmentMap, pathName)}
                  label={getFinalValue(labelMap, pathName)}
                  rules={getFinalValue(rulesMap as Partial<Record<Path<T>, any>>, pathName)}
                  options={getFinalValue(optionsMap as Partial<Record<Path<T>, any>>, pathName)}
                  autocompleteRenderInput={getFinalValue(autocompleteRenderInputMap, pathName)}
                  autocompleteRenderOption={getFinalValue(autocompleteRenderOptionMap as Partial<Record<Path<T>, any>>, pathName)}
                  autocompleteOnInputChange={getFinalValue(autocompleteOnInputChangeMap, pathName)}
                  autocompleteLoading={getFinalValue(autocompleteLoadingMap, pathName)}
                  hidden={getFinalValue(hiddenMap, pathName)}
                />
              );
            })()}
          </React.Fragment>
        ))}
      </FormGroup>
      <Button
        variant="outlined"
        disabled={model.disabled || model.readOnly || formLoading}
        sx={{ mt: 2 }}
        onClick={addItem}
      >
        {model.addButtonText ? t(model.addButtonText) : t("add")}
      </Button>
    </FormControl>
  );
}

export default DynamicArrayInput;
