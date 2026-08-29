import { SimpleFileView } from "./StorageItem";

type Gift = {
  id: number;
  name: string;
  quantity: number;
  thumbnailPath: string;
  isDeleted: boolean;
  deletedDate?: string;
  images: SimpleFileView[];
};

export type GiftView = {
  id: number;
  name: string;
  quantity: number;
  thumbnailPath: string;
};

export default Gift;
