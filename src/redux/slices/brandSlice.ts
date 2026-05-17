import Brand from "@/models/entities/Brand";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import brandApi from "../apis/brandApi";
import { RootState } from "../store";

const brandAdapter = createEntityAdapter<Brand>({
  sortComparer: (brand1, brand2) => brand1.name.localeCompare(brand2.name),
});

const initialState = brandAdapter.getInitialState();

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setAllBrands: brandAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        brandApi.endpoints.getAllBrands.matchFulfilled,
        brandAdapter.setAll
      );
  },
});

export const {
  setAllBrands,
} = brandSlice.actions;

const brandSelectors = brandAdapter.getSelectors<RootState>((state) => state.brand);
export const selectAllBrands = brandSelectors.selectAll;
export const selectBrandById = (id: number) => (state: RootState): Brand | undefined => brandSelectors.selectById(state, id);

export default brandSlice;
