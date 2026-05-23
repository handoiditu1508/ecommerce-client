import { useAppSelector } from "@/hooks";
import { useGetAllBrandsQuery } from "@/redux/apis/brandApi";
import { brandSelectors } from "@/redux/slices/brandSlice";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ActionDispatch, useMemo } from "react";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

export type BrandSelectorProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function BrandSelector({
  productsState,
  productsDispatch,
}: BrandSelectorProps) {
  const brands = useAppSelector(brandSelectors.all);
  const brandIdSet = useMemo<Set<number>>(() => new Set<number>(productsState.brandIds), [productsState.brandIds]);

  // get brands if not already fetched
  useGetAllBrandsQuery();

  const handleToggleBrand = (brandId: number, checked: boolean) => {
    const newBrandIds = checked
      ? [...productsState.brandIds, brandId]
      : productsState.brandIds.filter((id) => id !== brandId);
    productsDispatch({
      type: "SET_BRANDS",
      payload: newBrandIds,
    });
  };

  return (
    <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      px: 2,
    }}>
      {brands.map((brand) => <FormControlLabel
        key={brand.id}
        label={brand.name}
        slotProps={{
          typography: {
            variant: "body2",
          },
        }}
        control={
          <Checkbox
            size="small"
            checked={brandIdSet.has(brand.id)}
            onChange={(event, checked) => handleToggleBrand(brand.id, checked)}
          />
        }
      />)}
    </Box>
  );
}

export default BrandSelector;
