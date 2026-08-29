import { AllPagesFilter, SortFilter } from "../common";
import { PromotionBaseFilter } from "../promotion/promotionBaseFilter";

export type GetProductDiscountsQuery = SortFilter & AllPagesFilter & CountProductDiscountsQuery;

export type CountProductDiscountsQuery = PromotionBaseFilter & {
  requiredProductQuantity?: number;
  minDiscountValue?: number;
  maxDiscountValue?: number;
  isPercentage?: boolean;
};
