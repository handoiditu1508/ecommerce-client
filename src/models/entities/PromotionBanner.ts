type PromotionBanner = {
  id: number;
  imagePath: string;
  isVisible: boolean;
  status: PromotionBannerStatus;
  sortOrder?: number;
  promotionId: number;
};

export enum PromotionBannerStatus {
  Active,
  Disabled
}

export default PromotionBanner;
