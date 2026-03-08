export type ProductView = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  thumbnailPath: string;
  isDeleted: boolean;
  categoryId?: number;
};
