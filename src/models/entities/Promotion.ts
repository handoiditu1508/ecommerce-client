import GiftPromotion from "./GiftPromotion";
import InvoiceDiscount from "./InvoiceDiscount";
import ProductDiscount from "./ProductDiscount";

export type PromotionBase = {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: PromotionStatus;
};

export type PromotionViewBase = {
  id: number;
  name: string;
  startDate: string;
  endDate?: string;
  status: PromotionStatus;
};

export enum PromotionStatus {
  Active,
  Disabled
}

export enum PromotionType {
  GiftPromotion,
  ProductDiscount,
  InvoiceDiscount,
}

export type RequiredProductQuantity = {
  requiredProductQuantity: number;
};

export type DiscountValue = {
  discountValue: number;
  isPercentage: boolean;
};

export type ChooseProducts = {
  productIds: number[];
  categoryIds: number[];
  excludedProductIds: number[];
};

type Promotion = ProductDiscount |
  InvoiceDiscount |
  GiftPromotion;

export default Promotion;
