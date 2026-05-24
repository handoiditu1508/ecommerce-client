import CONFIG from "@/configs";
import { SearchProductsQuery } from "@/models/apis/product/searchProducts";
import { useReducer } from "react";
import { SearchOrderingValue } from "./Searchbar";

export type ProductsReducerState = {
  searchText: string;
  searchOrdering: SearchOrderingValue;
  categoryIds: number[];
  brandIds: number[];
  minPrice?: number;
  maxPrice?: number;
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
} | {
  type: "SET_PRICE_RANGE";
  payload: [number, number];
} | {
  type: "SET_MIN_PRICE" | "SET_MAX_PRICE";
  payload?: number;
} | {
  type: "CLEAR_FILTER";
} | {
  type: "SET_QUERY";
  payload: SearchProductsQuery;
};

const useProductsReducer = (initialState: ProductsReducerState) =>
  useReducer<ProductsReducerState, [ProductsReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_SEARCH_TEXT":
          return {
            ...state,
            searchText: action.payload,
          };
        case "SET_CATEGORIES":
          return {
            ...state,
            categoryIds: action.payload,
          };
        case "SET_BRANDS":
          return {
            ...state,
            brandIds: action.payload,
          };
        case "SET_SEARCH_ORDERING":
          return {
            ...state,
            searchOrdering: action.payload,
          };
        case "SET_PRICE_RANGE":
          return {
            ...state,
            minPrice: action.payload[0],
            maxPrice: action.payload[1],
          };
        case "SET_MIN_PRICE":
          return {
            ...state,
            minPrice: action.payload,
          };
        case "SET_MAX_PRICE":
          return {
            ...state,
            maxPrice: action.payload,
          };
        case "CLEAR_FILTER":
          return {
            ...state,
            categoryIds: CONFIG.EMPTY_ARRAY,
            brandIds: CONFIG.EMPTY_ARRAY,
            minPrice: undefined,
            maxPrice: undefined,
          };
        case "SET_QUERY":
          return {
            ...state,
            query: action.payload,
          };
      }
    },
    initialState,
  );

export default useProductsReducer;
