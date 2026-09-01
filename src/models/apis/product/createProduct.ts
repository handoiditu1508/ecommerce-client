export type CreateProductCommand = {
  name: string;
  price: number;
  thumbnailFile: FileList;
  categoryId?: number;
  sku: string;
  description?: string;
};
