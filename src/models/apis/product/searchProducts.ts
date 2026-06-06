import { SortDirection } from "../common";

export type SearchProductsQuery = {
  searchText: string;
  isDeleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryIds: number[];
  includeSubCategories?: boolean;
  brandIds: number[];
  sortBy?: string;
  sortOrder?: SortDirection;
  page?: number;
  pageSize?: number;
};

export type CountSearchProductsQuery = {
  searchText: string;
  isDeleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryIds: number[];
  includeSubCategories?: boolean;
  brandIds: number[];
};
