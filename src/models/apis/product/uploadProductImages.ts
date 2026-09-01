export type UploadProductImagesCommand = {
  productId: number;
  images: FileList | File[];
  /**
   * Parallel array to `images` (same order) used to correlate each uploaded image back to a
   * `data-local-id` placeholder in previously-saved content, e.g. a product's description.
   */
  localIds?: string[];
};
