import Brand from "@/models/entities/Brand";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const brandsAdapter = createEntityAdapter<Brand>({
  sortComparer: (brand1, brand2) => brand1.name.localeCompare(brand2.name),
});

const initialState = brandsAdapter.getInitialState();

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setAllBrands: brandsAdapter.setAll,
  },
});

export const {
  setAllBrands,
} = brandsSlice.actions;

const brandsSelectors = brandsAdapter.getSelectors<RootState>((state) => state.brands);
export const selectAllBrands = brandsSelectors.selectAll;
export const selectBrandById = (id: number) => (state: RootState): Brand | undefined => brandsSelectors.selectById(state, id);

export default brandsSlice;
