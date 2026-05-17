type Category = {
  id: number;
  name: string;
  iconPath?: string;
  parentId?: number;
  ancestorIds: number[];
  children: Category[];
};

export default Category;
