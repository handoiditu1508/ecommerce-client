export type SearchProductsQuery = {
  searchText: string;
  isDeleted?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryIds: number[];
  includeSubCategories?: boolean;
  brandIds: number[];
  orderBy?: string;
  orderByDescending?: boolean;
  page?: number;
  pageSize?: number;
};

export type CountSearchProductsQuery = {
  searchText: string;
};
