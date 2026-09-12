import { PageFilter } from "../common";

export type GetProductsByPromotionQuery = PageFilter & {
  promotionId: number;
};

export type CountProductsByPromotionQuery = {
  promotionId: number;
};
