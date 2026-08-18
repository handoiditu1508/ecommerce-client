import { ArrayItemType } from "@/common/type";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { FieldValues, Path, PathValue } from "react-hook-form";

type Category = {
  id: number;
  name: string;
  iconPath?: string;
  parentId?: number;
  ancestorIds: number[];
  children: Category[];
};

export const categoriesToDynamicInputOptions = <T extends FieldValues, K extends Path<T>>
(categories: Category[]): DynamicInputOption<T, K>[] => {
  return categories.map<DynamicInputOption<T, K>>(
    (c) => ({
      key: c.id,
      label: c.name,
      value: c.id as ArrayItemType<PathValue<T, K>>,
      children: categoriesToDynamicInputOptions(c.children),
    })
  );
};

export default Category;
