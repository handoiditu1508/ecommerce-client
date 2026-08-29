export type DeleteGiftCommand = {
  giftId: number;
  /**
   * Required when hard deleting to avoid accidental API by double clicking.
   */
  deletePhrase?: string;
};
