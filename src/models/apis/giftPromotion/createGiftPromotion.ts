export type CreateGiftPromotionCommand = {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  requiredProductQuantity?: number;
  productIds?: number[];
  categoryIds?: number[];
  excludedProductIds?: number[];
};
