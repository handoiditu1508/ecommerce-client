export type DeleteProductCommand = {
  productId: number;
  /**
   * Required when hard deleting to avoid accidental API by double clicking.
   */
  deletePhrase?: string;
};
