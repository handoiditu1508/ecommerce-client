export type UpdateGiftPromotionCommand = {
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  requiredProductQuantity?: number;
  productIds?: number[];
  categoryIds?: number[];
  excludedProductIds?: number[];
};
