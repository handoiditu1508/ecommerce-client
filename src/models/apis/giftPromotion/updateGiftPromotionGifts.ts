import { GiftPromotionDetail } from "@/models/entities/GiftPromotion";

export type UpdateGiftPromotionGiftsCommand = {
  id: number;
  giftPromotionDetails: GiftPromotionDetail[];
};
