export type ProductView = {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  thumbnailPath: string;
  isDeleted: boolean;
  categoryId?: number;
  discountPercentage: number;
};
