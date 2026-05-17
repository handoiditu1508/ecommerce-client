export type SearchProductsQuery = {
  searchText: string;
  orderBy?: string;
  orderByDescending?: boolean;
  page?: number;
  pageSize?: number;
};

export type CountSearchProductsQuery = {
  searchText: string;
};
