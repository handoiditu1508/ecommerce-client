import { ArrayItemType } from "@/common/type";
import { BreakpointsContext, smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import productApi from "@/redux/apis/productApi";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { selectClasses, SelectProps } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { ActionDispatch, ChangeEventHandler, FormEventHandler, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";
import { generateSearchParams } from "./utils";

const sortOptions = [
  {
    sortBy: "createdDate",
    sortOrder: "desc",
    labelKey: "order_by_newest",
  },
  {
    sortBy: "createdDate",
    sortOrder: "asc",
    labelKey: "order_by_oldest",
  },
  {
    sortBy: "discountPrice",
    sortOrder: "asc",
    labelKey: "order_by_price_ascending",
  },
  {
    sortBy: "discountPrice",
    sortOrder: "desc",
    labelKey: "order_by_price_descending",
  },
  {
    sortBy: "discountPercentage",
    sortOrder: "asc",
    labelKey: "order_by_discount_ascending",
  },
  {
    sortBy: "discountPercentage",
    sortOrder: "desc",
    labelKey: "order_by_discount_descending",
  },
] as const;

export type SearchOrderingValue = `${ArrayItemType<typeof sortOptions>["sortBy"]}-${ArrayItemType<typeof sortOptions>["sortOrder"]}`;

export type SearchbarProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

const NULL_FUNCTION = () => null;

function Searchbar({
  productsState,
  productsDispatch,
}: SearchbarProps) {
  const theme = useTheme();
  const { t: tProduct } = useTranslation("product");
  const { xsAndDown } = useContext(BreakpointsContext);
  const searchProductsResult = productApi.endpoints.searchProducts.useQueryState(productsState.query);
  const [, setSearchParams] = useSearchParams();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSearchParams(generateSearchParams(productsState));
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
        placeholder={tProduct("search_placeholder")}
        inputProps={{
          "aria-label": "search products",
        }}
        value={productsState.searchText}
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
        renderValue={xsAndDown ? NULL_FUNCTION : undefined}
        sx={{
          width: "14%",
          maxWidth: 240,
          minWidth: 100,
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            width: "initial",
            minWidth: "initial",
          },
          [`.${selectClasses.iconOpen}`]: {
            transform: "none",
          },
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
        IconComponent={SortIcon}
        onChange={handleOrderingChange}>
        {sortOptions.map((o) => (
          <MenuItem key={o.sortBy + o.sortOrder} value={`${o.sortBy}-${o.sortOrder}`}>
            {tProduct(o.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
}

export default Searchbar;
