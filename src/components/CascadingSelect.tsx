import CONFIG from "@/configs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import React, { useId, useMemo, useState } from "react";

type CascadingSelectProps<T, V extends string | number> = {
  items: T[];
  value: V | V[];
  label?: React.ReactNode;
  readOnly?: boolean;
  multiple?: boolean;
  leafOnly?: boolean;
  helperText?: string;
  selectKey: (item: T) => React.Key;
  selectValue: (item: T) => V;
  selectLabel: (item: T) => string;
  selectChildren: (item: T) => T[];
  onBlur?: () => void;
  onChange?: (value?: V | V[]) => void;
} & FormControlProps;

function CascadingSelect<T, V extends string | number>({
  items,
  value,
  label,
  readOnly,
  multiple,
  leafOnly,
  helperText,
  selectKey,
  selectValue,
  selectLabel,
  selectChildren,
  onBlur,
  onChange = CONFIG.EMPTY_FUNCTION,
  ...props
}: CascadingSelectProps<T, V>) {
  const labelId = useId();
  const [parentPath, setParentPath] = useState<T[]>([]);
  const allItems = useMemo(() => {
    const flatten = (items: T[]): T[] => items.flatMap((item) => [item, ...flatten(selectChildren(item))]);

    return flatten(items);
  }, [items, selectChildren]);
  const currentParent: T | undefined = parentPath[parentPath.length - 1];
  const options: T[] = currentParent ? selectChildren(currentParent) : items;
  const selectedItems: T[] = Array.isArray(value)
    ? allItems.filter((item) => value.includes(selectValue(item)))
    : [allItems.find((item) => selectValue(item) === value)].filter((i) => i !== undefined);

  return (
    <FormControl {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        readOnly={readOnly}
        multiple={multiple}
        value={value}
        renderValue={() => multiple
          ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selectedItems.map((item) => (
                <Chip key={selectKey(item)} label={selectLabel(item)} size="small" />
              ))}
            </Box>
          )
          : selectedItems[0] ? selectLabel(selectedItems[0]) : ""}
        onBlur={onBlur}
        onChange={(event) => {
          const newValues = event.target.value;
          if (multiple) {
            onChange(Array.isArray(newValues) ? newValues : CONFIG.EMPTY_ARRAY);
          } else {
            onChange(!Array.isArray(newValues) ? newValues as V : newValues[0]);
          }
        }}
      >
        {currentParent && <ListSubheader sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            aria-label="Back to parent"
            onClick={(event) => {
              event.stopPropagation();
              setParentPath((path) => path.slice(0, -1));
            }}><ArrowBackIcon fontSize="small" />
          </IconButton>
          <Tooltip title={parentPath.map(selectLabel).join(" / ")}>
            <span>{selectLabel(currentParent)}</span>
          </Tooltip>
        </ListSubheader>}
        {options.map((option) => {
          const isLeaf = selectChildren(option).length === 0;

          return (
            <MenuItem
              key={selectKey(option)}
              value={selectValue(option)}
              onClick={(event) => {
                if (leafOnly && !isLeaf) {
                  event.stopPropagation();
                  setParentPath((path) => [...path, option]);
                }
              }}>
              {selectLabel(option)}
              {!isLeaf && (
                <IconButton
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setParentPath((path) => [...path, option]);
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              )}
            </MenuItem>
          );
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default CascadingSelect;
