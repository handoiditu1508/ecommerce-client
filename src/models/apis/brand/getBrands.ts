import { AllPagesFilter, SortFilter } from "../common";

export type GetBrandsQuery = SortFilter & AllPagesFilter & CountBrandsQuery;

export type CountBrandsQuery = {
  id?: number;
  name?: string;
  hasLogo?: boolean;
  isTop?: boolean;
  hasActiveProduct?: boolean;
};
