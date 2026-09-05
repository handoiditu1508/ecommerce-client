export type UpdateBrandCommand = {
  id: number;
  name: string;
  logoFile?: FileList;
  isRemoveLogo?: boolean;
  isTop: boolean;
};
