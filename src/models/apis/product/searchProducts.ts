export type SearchProductsQuery = {
  searchText: string;
  orderBy?: string;
  orderByDescending?: boolean;
  page?: number;
  pageSize?: number;
  loadDiscountPrice?: boolean;
};

export type CountSearchProductsQuery = {
  searchText: string;
};
