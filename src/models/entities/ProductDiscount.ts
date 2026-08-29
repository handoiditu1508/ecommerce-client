import { ChooseProducts, DiscountValue, PromotionBase, PromotionType, PromotionViewBase, RequiredProductQuantity } from "./Promotion";

type ProductDiscount = PromotionBase &
  RequiredProductQuantity &
  DiscountValue &
  ChooseProducts &
  {
    type: PromotionType.ProductDiscount;
  };

export type ProductDiscountView = PromotionViewBase & {
  type: PromotionType.ProductDiscount;
};

export default ProductDiscount;
