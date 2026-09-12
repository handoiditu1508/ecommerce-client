import { AllPagesFilter, SortFilter } from "../common";

export type GetPromotionBannersQuery = SortFilter & AllPagesFilter & CountPromotionBannersQuery;

export type CountPromotionBannersQuery = {};
