import Product from "@/models/entities/Product";
import { PageFilter, SortFilter } from "../common";

export type SearchProductsQuery = PageFilter & SortFilter<Product> & CountSearchProductsQuery;

export type CountSearchProductsQuery = {
  searchText: string;
  isDeleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryIds: number[];
  includeSubCategories?: boolean;
  brandIds: number[];
};
