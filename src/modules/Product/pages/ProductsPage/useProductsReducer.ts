import { SearchProductsQuery } from "@/models/apis/product/searchProducts";
import { useReducer } from "react";
import { SearchOrderingValue } from "./Searchbar";

export type ProductsReducerState = {
  searchOrdering: SearchOrderingValue;
  query: SearchProductsQuery;
};

export type ProductsReducerAction = {
  type: "SET_SEARCH_TEXT";
  payload: string;
} | {
  type: "SET_SEARCH_ORDERING";
  payload: SearchOrderingValue;
} | {
  type: "SET_CATEGORIES" | "SET_BRANDS";
  payload: number[];
};

const initialState: ProductsReducerState = {
  searchOrdering: "createdDate-false",
  query: {
    searchText: "",
    categoryIds: [],
    includeSubCategories: false, // disabled since tree view will auto select all children
    brandIds: [],
    minPrice: 0,
    maxPrice: 1000000,
    orderBy: "createdDate",
    orderByDescending: false,
  },
};

const useProductsReducer = () =>
  useReducer<ProductsReducerState, [ProductsReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_SEARCH_TEXT":
          return {
            ...state,
            query: {
              ...state.query,
              searchText: action.payload,
            },
          };
        case "SET_CATEGORIES":
          return {
            ...state,
            query: {
              ...state.query,
              categoryIds: action.payload,
            },
          };
        case "SET_BRANDS":
          return {
            ...state,
            query: {
              ...state.query,
              brandIds: action.payload,
            },
          };
        case "SET_SEARCH_ORDERING":
          const [orderBy, orderByDescendingText] = action.payload.split("-");

          return {
            ...state,
            searchOrdering: action.payload,
            query: {
              ...state.query,
              orderBy,
              orderByDescending: orderByDescendingText === "true" ? true : false,
            },
          };
      }
    },
    initialState
  );

export default useProductsReducer;
