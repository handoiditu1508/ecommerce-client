export type UpdateProductCommand = {
  id: number;
  name: string;
  price: number;
  thumbnailId: string;
  thumbnailFile?: FileList;
  categoryId?: number;
  description?: string;
};
