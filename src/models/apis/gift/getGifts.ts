import { AllPagesFilter, SortFilter } from "../common";

export type GetGiftsQuery = SortFilter & AllPagesFilter & CountGiftsQuery;

export type CountGiftsQuery = {
  id?: number;
  name?: string;
  quantity?: number;
  isDeleted?: boolean;
  deletedDate?: Date;
};
