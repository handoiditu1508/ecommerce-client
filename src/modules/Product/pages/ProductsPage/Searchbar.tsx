import { ArrayItemType } from "@/common/typeHelpers";
import CONFIG from "@/configs";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectProps } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { ChangeEventHandler, FormEventHandler } from "react";

const orderingOptions = [
  {
    propertyName: "createdDate",
    isDescending: true,
    label: "Order by newest",
  },
  {
    propertyName: "createdDate",
    isDescending: false,
    label: "Order by oldest",
  },
  {
    propertyName: "discountPrice",
    isDescending: false,
    label: "Order by price ascending",
  },
  {
    propertyName: "discountPrice",
    isDescending: true,
    label: "Order by price descending",
  },
  {
    propertyName: "discountPercentage",
    isDescending: false,
    label: "Order by discount ascending",
  },
  {
    propertyName: "discountPercentage",
    isDescending: true,
    label: "Order by discount descending",
  },
] as const;

export type SearchbarProps = {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ordering?: `${ArrayItemType<typeof orderingOptions>["propertyName"]}-${ArrayItemType<typeof orderingOptions>["isDescending"]}`;
  onChangeOrdering?: SelectProps<Exclude<SearchbarProps["ordering"], undefined>>["onChange"];
  onSubmit?: FormEventHandler<HTMLFormElement>;
  loading?: boolean;
};

function Searchbar({
  value = "",
  onChange,
  ordering = "createdDate-false",
  onChangeOrdering,
  onSubmit = CONFIG.EMPTY_FUNCTION,
  loading,
}: SearchbarProps) {
  const theme = useTheme();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <Paper
      variant="outlined"
      component="form"
      sx={{
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: "none",
        boxSizing: "border-box",
        ml: 2,
        display: "flex",
        alignItems: "center",
        [smAndDownMediaQuery(theme.breakpoints)]: {
          backgroundColor: "transparent",
          border: "none",
          ml: 0,
        },
      }}
      onSubmit={handleSubmit}>
      <IconButton
        type="submit"
        sx={{
          p: 1.5,
        }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{
          flex: 1,
        }}
        placeholder="black trench coat..."
        inputProps={{
          "aria-label": "search products",
        }}
        value={value}
        endAdornment={loading
          ? (
            <InputAdornment position="end">
              <CircularProgress size={32} />
            </InputAdornment>
          )
          : undefined}
        onChange={onChange}
      />
      <Select
        value={ordering}
        sx={{
          width: "14%",
          maxWidth: 240,
          minWidth: 100,
        }}
        slotProps={{
          notchedOutline: {
            sx: {
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderRadius: 0,
              [smAndDownMediaQuery(theme.breakpoints)]: {
                backgroundColor: "transparent",
                border: "none",
              },
            },
          },
        }}
        onChange={onChangeOrdering}>
        {orderingOptions.map((o) => <MenuItem key={o.propertyName + o.isDescending} value={`${o.propertyName}-${o.isDescending}`}>{o.label}</MenuItem>)}
      </Select>
    </Paper>
  );
}

export default Searchbar;
