export type UpdateProductCommand = {
  id: number;
  name: string;
  price: number;
  thumbnailFile?: File;
  categoryId?: number;
};
