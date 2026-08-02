import Category from "@/models/entities/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { useMemo, useState } from "react";

type Props = {
  categories: Category[];
  value?: number;
  label: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onChange: (value?: number) => void;
};

const flatten = (categories: Category[]): Category[] => categories.flatMap(
  (category) => [category, ...flatten(category.children)],
);

function CascadingCategorySelect({ categories, value, label, disabled, error, helperText, onBlur, onChange }: Props) {
  const [parentPath, setParentPath] = useState<Category[]>([]);
  const allCategories = useMemo(() => flatten(categories), [categories]);
  const currentParent = parentPath[parentPath.length - 1];
  const options = currentParent?.children ?? categories;
  const selectedCategory = allCategories.find((category) => category.id === value);

  return (
    <FormControl fullWidth margin="normal" error={error} disabled={disabled}>
      <InputLabel id="category-select-label">{label}</InputLabel>
      <Select
        labelId="category-select-label"
        label={label}
        value={value ?? ""}
        renderValue={() => selectedCategory?.name ?? ""}
        onBlur={onBlur}
        onChange={(event) => onChange(
          typeof event.target.value === "number" ? event.target.value : undefined,
        )}
      >
        {currentParent && <ListSubheader sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            aria-label="Back to parent category"
            onClick={(event) => {
              event.stopPropagation();
              setParentPath((path) => path.slice(0, -1));
            }}><ArrowBackIcon fontSize="small" />
          </IconButton>
          <Tooltip title={parentPath.map((category) => category.name).join(" / ")}>
            <span>{currentParent.name}</span>
          </Tooltip>
        </ListSubheader>}
        {options.map((category) => {
          const isLeaf = category.children.length === 0;

          return (
            <MenuItem
              key={category.id}
              value={isLeaf ? category.id : ""}
              onClick={(event) => {
                if (!isLeaf) {
                  event.stopPropagation(); setParentPath((path) => [...path, category]);
                }
              }}>
              {category.name}
              {!isLeaf && (
                <IconButton
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={(event) => {
                    event.stopPropagation(); setParentPath((path) => [...path, category]);
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

export default CascadingCategorySelect;
