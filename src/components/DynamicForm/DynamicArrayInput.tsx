import CONFIG from "@/configs";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ArrayPath, FieldValues, Path, UseFormReturn, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DynamicFormProps } from "./DynamicForm";
import DynamicInput, { DynamicInputProps } from "./DynamicInput";
import { DynamicArrayInputModel, DynamicInputModel } from "./models";

export type DynamicArrayInputProps<T extends FieldValues, K extends Path<T>> = {
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
  renderInputMap?: DynamicFormProps<T>["renderInputMap"];
  arrayItemActionsMap?: DynamicFormProps<T>["arrayItemActionsMap"];
};

/**
 * Get value for specific item in field array.
 * @param map A dictionary whose values share the generic value type.
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
const getFinalValue = <T extends FieldValues, V>(map: Partial<Record<Path<T>, V>>, path: Path<T>): V | undefined => {
  let finalValue: V | undefined = map[path];
  if (finalValue === undefined) {
    const wildcardPath = path.replace(/\.[0-9]+(?=\.|$)/g, ".-1") as Path<T>;
    finalValue = map[wildcardPath];
  }

  return finalValue;
};

function DynamicArrayInput<T extends FieldValues, K extends Path<T>>({
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
  renderInputMap = CONFIG.EMPTY_OBJECT,
  arrayItemActionsMap = CONFIG.EMPTY_OBJECT,
}: DynamicArrayInputProps<T, K>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [itemActionMenuAnchor, setItemActionMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [itemActionMenuIndex, setItemActionMenuIndex] = React.useState<number | null>(null);
  const { fields, append, remove } = useFieldArray<T, ArrayPath<T>>({
    control: formContext.control,
    name: model.name as ArrayPath<T>, // lie to type checking that this is ArrayPath<T>
  });
  const finalLabel = label || model.label;
  const itemActions = getFinalValue(arrayItemActionsMap, model.name) ?? [];

  const closeItemActionMenu = () => {
    setItemActionMenuAnchor(null);
    setItemActionMenuIndex(null);
  };

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
          <Box
            key={field.id}
            sx={{ bgcolor: index % 2 === 0 ? "transparent" : "action.hover", mx: -2, px: 2, pb: 1 }}
          >
            {(itemActions.length > 0 || (!model.readOnly && (!model.required || fieldsArray.length > 1))) && (
              <Box sx={{ textAlign: "right" }}>
                <IconButton
                  aria-label={t("actions")}
                  disabled={model.disabled || formLoading}
                  onClick={(event) => {
                    setItemActionMenuAnchor(event.currentTarget);
                    setItemActionMenuIndex(index);
                  }}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={itemActionMenuAnchor}
                  open={itemActionMenuIndex === index}
                  onClose={closeItemActionMenu}>
                  {itemActions.map((itemAction) => (
                    <MenuItem
                      key={itemAction.key}
                      disabled={model.disabled || formLoading || (
                        typeof itemAction.disabled === "function"
                          ? itemAction.disabled(formContext.getValues(), index)
                          : itemAction.disabled
                      )}
                      onClick={() => {
                        itemAction.onClick(formContext.getValues(), index);
                        closeItemActionMenu();
                      }}>
                      {itemAction.icon && <ListItemIcon>{itemAction.icon}</ListItemIcon>}
                      {typeof itemAction.label === "string" ? t(itemAction.label) : itemAction.label}
                    </MenuItem>
                  ))}
                  {!model.readOnly && (!model.required || fieldsArray.length > 1) && (
                    <>
                      {itemActions.length > 0 && <Divider />}
                      <MenuItem
                        disabled={model.disabled || formLoading}
                        sx={{ color: "error.main" }}
                        onClick={() => {
                          remove(index);
                          closeItemActionMenu();
                        }}>
                        <ListItemIcon sx={{ color: "inherit" }}><DeleteIcon /></ListItemIcon>
                        {model.removeButtonText ? t(model.removeButtonText) : t("remove")}
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            )}

            {"itemInputs" in model && (
              <Grid columnSpacing={1} container>
                {model.itemInputs.map((itemInput) => {
                  const pathName = `${model.name}.${index}.${itemInput.name}` as K;

                  return (
                    <Grid key={itemInput.name} size={itemInput.size ?? 12}>
                      {getFinalValue(renderInputMap, pathName) ?? (
                        <DynamicInput
                          model={{
                            ...itemInput,
                            name: pathName,
                          } as unknown as DynamicInputModel<T, K>}
                          formContext={formContext}
                          formLoading={formLoading}
                          startAdornment={getFinalValue(startAdornmentMap, pathName)}
                          endAdornment={getFinalValue(endAdornmentMap, pathName)}
                          label={getFinalValue(labelMap, pathName)}
                          rules={getFinalValue(
                            rulesMap as Partial<Record<Path<T>, DynamicInputProps<T, K>["rules"]>>,
                            pathName,
                          )}
                          options={getFinalValue(
                            optionsMap as Partial<Record<Path<T>, DynamicInputProps<T, K>["options"]>>,
                            pathName,
                          )}
                          autocompleteRenderInput={getFinalValue(autocompleteRenderInputMap, pathName)}
                          autocompleteRenderOption={getFinalValue(
                            autocompleteRenderOptionMap as Partial<
                              Record<Path<T>, DynamicInputProps<T, K>["autocompleteRenderOption"]>
                            >,
                            pathName,
                          )}
                          autocompleteOnInputChange={getFinalValue(autocompleteOnInputChangeMap, pathName)}
                          autocompleteLoading={getFinalValue(autocompleteLoadingMap, pathName)}
                          hidden={getFinalValue(hiddenMap, pathName)}
                        />
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {"itemInput" in model && (() => {
              const pathName = `${model.name}.${index}` as K;

              return getFinalValue(renderInputMap, pathName) ?? (
                <DynamicInput
                  model={{
                    ...model.itemInput,
                    name: pathName,
                  } as unknown as DynamicInputModel<T, K>}
                  formContext={formContext}
                  formLoading={formLoading}
                  startAdornment={getFinalValue(startAdornmentMap, pathName)}
                  endAdornment={getFinalValue(endAdornmentMap, pathName)}
                  label={getFinalValue(labelMap, pathName)}
                  rules={getFinalValue(
                    rulesMap as Partial<Record<Path<T>, DynamicInputProps<T, K>["rules"]>>,
                    pathName,
                  )}
                  options={getFinalValue(
                    optionsMap as Partial<Record<Path<T>, DynamicInputProps<T, K>["options"]>>,
                    pathName,
                  )}
                  autocompleteRenderInput={getFinalValue(autocompleteRenderInputMap, pathName)}
                  autocompleteRenderOption={getFinalValue(
                    autocompleteRenderOptionMap as Partial<
                      Record<Path<T>, DynamicInputProps<T, K>["autocompleteRenderOption"]>
                    >,
                    pathName,
                  )}
                  autocompleteOnInputChange={getFinalValue(autocompleteOnInputChangeMap, pathName)}
                  autocompleteLoading={getFinalValue(autocompleteLoadingMap, pathName)}
                  hidden={getFinalValue(hiddenMap, pathName)}
                />
              );
            })()}
          </Box>
        ))}
      </FormGroup>
      {!model.readOnly && (
        <Button
          variant="outlined"
          disabled={model.disabled || formLoading}
          sx={{ mt: 2 }}
          onClick={addItem}
        >
          {model.addButtonText ? t(model.addButtonText) : t("add")}
        </Button>
      )}
    </FormControl>
  );
}

export default DynamicArrayInput;
