import Category from "@/models/entities/Category";
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import categoryApi from "../apis/categoryApi";
import { RootState } from "../store";

const categoryAdapter = createEntityAdapter<Category>({
  sortComparer: (category1, category2) => category1.name.localeCompare(category2.name),
});

type CategoryOwnState = {
  tree: Category[];
};

const initialState = categoryAdapter.getInitialState<CategoryOwnState>({
  tree: [],
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoriesTree: (state, action: PayloadAction<Category[]>) => {
      categoryAdapter.removeAll(state);
      const queue: Category[] = [...action.payload];
      while (queue.length) {
        const category = queue.shift()!;
        categoryAdapter.setOne(state, category);
        queue.push(...category.children);
      }
      state.tree = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        categoryApi.endpoints.getCategoryTrees.matchFulfilled,
        (state, action) => {
          const newAction = categorySlice.actions.setCategoriesTree(action.payload);
          categorySlice.caseReducers.setCategoriesTree(state, newAction);
        }
      );
  },
});

export const {
  setCategoriesTree,
} = categorySlice.actions;

const categorySelectors = categoryAdapter.getSelectors<RootState>((state) => state.category);
export const selectCategoryById = categorySelectors.selectById;
export const selectCategoriesTree = (state: RootState) => state.category.tree;

export default categorySlice;
