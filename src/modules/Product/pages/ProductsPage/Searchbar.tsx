import { ArrayItemType } from "@/common/typeHelpers";
import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import { useLazySearchProductsQuery } from "@/redux/apis/productApi";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectProps } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { ActionDispatch, ChangeEventHandler, FormEventHandler } from "react";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

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

export type SearchOrderingValue = `${ArrayItemType<typeof orderingOptions>["propertyName"]}-${ArrayItemType<typeof orderingOptions>["isDescending"]}`;

export type SearchbarProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function Searchbar({
  productsState,
  productsDispatch,
}: SearchbarProps) {
  const theme = useTheme();
  const [seachProductsTrigger, searchProductsResult] = useLazySearchProductsQuery();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    seachProductsTrigger(productsState.query);
  };

  const handleSearchTextChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    productsDispatch({
      type: "SET_SEARCH_TEXT",
      payload: event.target.value,
    });
  };

  const handleOrderingChange: SelectProps<SearchOrderingValue>["onChange"] = (event) => {
    productsDispatch({
      type: "SET_SEARCH_ORDERING",
      payload: event.target.value,
    });
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
        disabled={searchProductsResult.isFetching}
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
        value={productsState.query.searchText}
        endAdornment={searchProductsResult.isFetching
          ? (
            <InputAdornment position="end">
              <CircularProgress size={32} />
            </InputAdornment>
          )
          : undefined}
        onChange={handleSearchTextChange}
      />
      <Select
        value={productsState.searchOrdering}
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
        onChange={handleOrderingChange}>
        {orderingOptions.map((o) => <MenuItem key={o.propertyName + o.isDescending} value={`${o.propertyName}-${o.isDescending}`}>{o.label}</MenuItem>)}
      </Select>
    </Paper>
  );
}

export default Searchbar;
