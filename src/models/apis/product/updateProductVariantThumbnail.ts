export type UpdateProductVariantThumbnailCommand = {
  /**
   * Product variant id.
   */
  id: number;
  productId: number;
  thumbnailFile?: FileList;
};
