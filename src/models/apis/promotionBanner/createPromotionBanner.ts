import { PromotionBannerStatus } from "@/models/entities/PromotionBanner";

export type CreatePromotionBannerCommand = {
  promotionId: number;
  imageFile: FileList;
  isVisible: boolean;
  status: PromotionBannerStatus;
  sortOrder?: number;
};
