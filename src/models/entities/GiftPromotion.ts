import { GiftView } from "./Gift";
import { ChooseProducts, PromotionBase, PromotionType, PromotionViewBase, RequiredProductQuantity } from "./Promotion";

type GiftPromotion = PromotionBase & RequiredProductQuantity & ChooseProducts & {
  type: PromotionType.GiftPromotion;
  giftPromotionDetails: GiftPromotionDetail[];
};

export type GiftPromotionDetail = {
  giftId: number;
  quantity: number;
  giftViewDto?: GiftView;
};

export type GiftPromotionView = PromotionViewBase & {
  type: PromotionType.InvoiceDiscount;
};

export default GiftPromotion;
