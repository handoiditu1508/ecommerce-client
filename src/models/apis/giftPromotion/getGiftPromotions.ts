import { PageFilter, SortFilter } from "../common";
import { PromotionBaseFilter } from "../promotion/promotionBaseFilter";

export type GetGiftPromotionsQuery = SortFilter & PageFilter & CountGiftPromotionsQuery;

export type CountGiftPromotionsQuery = PromotionBaseFilter & {
  requiredProductQuantity?: number;
};
