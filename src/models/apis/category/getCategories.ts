import { AllPagesFilter, SortFilter } from "../common";

export type GetCategoriesQuery = SortFilter & AllPagesFilter & CountCategoriesQuery;

export type CountCategoriesQuery = {
  id?: number;
  name?: string;
  hasIcon?: boolean;
  parentId?: number;
};
