export type CreateProductCommand = {
  name: string;
  price: number;
  thumbnailFile: File;
  categoryId?: number;
  sku: string;
};
