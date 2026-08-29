import { DiscountValue, PromotionBase, PromotionType, PromotionViewBase } from "./Promotion";

type InvoiceDiscount = PromotionBase &
  DiscountValue &
  {
    discountCode: string;
    discountLimit?: number;
    requiredInvoiceValue?: number;
    usesLimit?: number;
    usesLimitsPerUser?: number;
    type: PromotionType.InvoiceDiscount;
  };

export type InvoiceDiscountView = PromotionViewBase &
  DiscountValue &
  {
    type: PromotionType.InvoiceDiscount;
    discountCode: string;
  };

export default InvoiceDiscount;
