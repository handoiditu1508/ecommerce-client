export type CreateProductDiscountCommand = {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  requiredProductQuantity?: number;
  discountValue: number;
  isPercentage: boolean;
  productIds?: number[];
  categoryIds?: number[];
  excludedProductIds?: number[];
};
