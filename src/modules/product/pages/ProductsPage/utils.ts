import { ProductsReducerState } from "./useProductsReducer";

export const generateSearchParams = (state: ProductsReducerState): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};
  if (state.searchText) {
    params.search = state.searchText;
  }
  if (state.searchOrdering) {
    params.sort = state.searchOrdering;
  }
  if (state.categoryIds.length) {
    params.category = state.categoryIds.map((id) => id.toString());
  }
  if (state.brandIds.length) {
    params.brand = state.brandIds.map((id) => id.toString());
  }
  if (state.minPrice) {
    params.min = state.minPrice.toString();
  }
  if (state.maxPrice) {
    params.max = state.maxPrice.toString();
  }

  return params;
};
