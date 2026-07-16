import Brand from "@/models/entities/Brand";
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import brandApi from "../apis/brandApi";
import { RootState } from "../store";

const brandAdapter = createEntityAdapter<Brand>({
  sortComparer: (brand1, brand2) => brand1.name.localeCompare(brand2.name),
});

type BrandOwnState = {
  /**
   * Id of brands that have at least 1 active product.
   */
  brandHasActiveProductIds: number[];
};

const initialState = brandAdapter.getInitialState<BrandOwnState>({
  brandHasActiveProductIds: [],
});

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setAllBrands: brandAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        brandApi.endpoints.getBrandsHaveActiveProduct.matchFulfilled,
        (state, action) => {
          brandAdapter.setMany(state, action.payload);
          state.brandHasActiveProductIds = action.payload.map((b) => b.id);
        }
      )
      .addMatcher(
        brandApi.endpoints.getAllBrands.matchFulfilled,
        brandAdapter.setMany
      );
  },
});

export const {
  setAllBrands,
} = brandSlice.actions;

const brandAdapterSelectors = brandAdapter.getSelectors<RootState>((state) => state.brand);
export const brandSelectors = {
  all: brandAdapterSelectors.selectAll,
  byId: (id: number) => (state: RootState): Brand | undefined => brandAdapterSelectors.selectById(state, id),
  haveActiveProducts: createSelector(
    [
      (state: RootState) => state.brand.brandHasActiveProductIds,
      (state: RootState) => state.brand.entities,
    ],
    (ids, entities) => ids.map((id) => entities[id]).filter((b) => !!b)
  ),
};

export default brandSlice;
