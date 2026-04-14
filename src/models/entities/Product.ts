import { SimpleFileView } from "./StorageItem";

type Product = {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  thumbnailPath: string;
  categoryId?: number;
  brandId?: number;
  description?: string;
  createdDate: string;
  modifiedDate: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted: boolean;
  deletedDate?: string;
  images: SimpleFileView[];
  productVariants: ProductVariant[];
  discountPercentage: number;
};

export type ProductVariant = {
  id: number;
  productId: number;
  sku: string;
  quantity: number;
  name: string;
  color?: string;
  thumbnailPath?: string;
  price?: number;
};

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

export default Product;
