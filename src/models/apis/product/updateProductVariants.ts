export type UpdateProductVariantsCommand = {
  /**
   * Product id.
   */
  id: number;
  productVariants: UpdateProductVariantRequest[];
};

export type UpdateProductVariantRequest = {
  /**
   * Product variant id.
   */
  id: number;
  sku: string;
  name: string;
  color?: string;
  thumbnailId?: string;
};
