import { PageFilter, SortFilter } from "../common";

export type GetGiftsQuery = SortFilter & PageFilter & CountGiftsQuery;

export type CountGiftsQuery = {
  id?: number;
  name?: string;
  quantity?: number;
  isDeleted?: boolean;
  deletedDate?: Date;
};
