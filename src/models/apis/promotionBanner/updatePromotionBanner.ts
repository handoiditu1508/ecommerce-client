import { PromotionBannerStatus } from "@/models/entities/PromotionBanner";

export type UpdatePromotionBannerCommand = {
  id: number;
  promotionId: number;
  imageFile?: FileList;
  isVisible: boolean;
  status: PromotionBannerStatus;
  sortOrder?: number;
};
