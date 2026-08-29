import { PageFilter, SortFilter } from "../common";
import { PromotionBaseFilter } from "../promotion/promotionBaseFilter";

export type GetInvoiceDiscountsQuery = SortFilter & PageFilter & CountInvoiceDiscountsQuery;

export type CountInvoiceDiscountsQuery = PromotionBaseFilter & {
  discountCode?: string;
  minDiscountValue?: number;
  maxDiscountValue?: number;
  isPercentage?: boolean;
  minDiscountLimit?: number;
  maxDiscountLimit?: number;
  minRequiredInvoiceValue?: number;
  maxRequiredInvoiceValue?: number;
  usesLimit?: number;
  usesLimitsPerUser?: number;
};
