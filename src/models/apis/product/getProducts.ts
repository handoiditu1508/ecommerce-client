import { PageFilter, SortFilter } from "../common";

export type GetProductsQuery = SortFilter & PageFilter & CountProductsQuery;

export type CountProductsQuery = {
  isDeleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
  createdDate?: Date;
  modifiedDate?: Date;
  id?: number;
  name?: string;
  /**
   * `0` to filter `categoryId` equals `null`.
   */
  categoryIds?: number[];
  includeSubCategories?: boolean;
  /**
   * Ids of products to leave out of the result.
   */
  excludedProductIds?: number[];
};
