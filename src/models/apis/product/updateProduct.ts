export type UpdateProductCommand = {
  id: number;
  name: string;
  price: number;
  thumbnailFile?: FileList;
  categoryId?: number;
};
