import { useAppSelector } from "@/hooks";
import Brand from "@/models/entities/Brand";
import { useGetBrandsHaveActiveProductQuery } from "@/redux/apis/brandApi";
import { brandSelectors } from "@/redux/slices/brandSlice";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputBase from "@mui/material/InputBase";
import { ActionDispatch, ChangeEventHandler, useMemo, useState } from "react";
import { List, RowComponentProps } from "react-window";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

export type BrandSelectorProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function RowComponent({
  index,
  style,
  brands,
  brandIdSet,
  onBrandToggle,
}: RowComponentProps<{
  brands: Brand[];
  brandIdSet: Set<number>;
  onBrandToggle: (brandId: number, checked: boolean) => void;
}>) {
  const brand = brands[index];

  return (
    <FormControlLabel
      label={brand.name}
      style={style}
      sx={{
        margin: 0,
      }}
      slotProps={{
        typography: {
          variant: "body2",
          noWrap: true,
        },
      }}
      control={
        <Checkbox
          size="small"
          checked={brandIdSet.has(brand.id)}
          onChange={(event, checked) => onBrandToggle(brand.id, checked)}
        />
      }
    />
  );
}

function BrandSelector({
  productsState,
  productsDispatch,
}: BrandSelectorProps) {
  const brands = useAppSelector(brandSelectors.haveActiveProducts);
  const brandIdSet = useMemo<Set<number>>(() => new Set<number>(productsState.brandIds), [productsState.brandIds]);
  const [searchText, setSearchText] = useState<string>("");
  const memorizedBrands = useMemo(
    () => searchText ? brands.filter((b) => b.name.toLowerCase().includes(searchText.toLowerCase())) : brands,
    [brands, searchText]
  );

  // get brands if not already fetched
  useGetBrandsHaveActiveProductQuery();

  const handleToggleBrand = (brandId: number, checked: boolean) => {
    const newBrandIds = checked
      ? [...productsState.brandIds, brandId]
      : productsState.brandIds.filter((id) => id !== brandId);
    productsDispatch({
      type: "SET_BRANDS",
      payload: newBrandIds,
    });
  };

  const handleSearchTextChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        pl: 1,
        gap: 0.75,
      }}>
        <SearchIcon />
        <InputBase
          value={searchText}
          placeholder="search here..."
          inputProps={{
            "aria-label": "search brands",
          }}
          sx={{
            flex: 1,
          }}
          onChange={handleSearchTextChange}
        />
      </Box>
      <List
        style={{
          height: 400,
        }}
        rowComponent={RowComponent}
        rowCount={memorizedBrands.length}
        rowHeight={38}// get value from browser debug mode
        rowProps={{
          brands: memorizedBrands,
          brandIdSet,
          onBrandToggle: handleToggleBrand,
        }}
      />
    </>
  );
}

export default BrandSelector;
