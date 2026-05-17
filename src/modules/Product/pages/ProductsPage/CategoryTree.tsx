import { useAppSelector } from "@/hooks";
import Category from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { selectCategoriesTree } from "@/redux/slices/categorySlice";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { CheckboxProps } from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { useApplyPropagationToSelectedItemsOnMount } from "@mui/x-tree-view/hooks";
import { UseTreeViewSelectionParameters } from "@mui/x-tree-view/internals";
import { TreeViewBaseItem, TreeViewSelectionPropagation } from "@mui/x-tree-view/models";
import { RichTreeView, richTreeViewClasses } from "@mui/x-tree-view/RichTreeView";
import { ActionDispatch, useEffect, useMemo } from "react";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

const categoryToTreeViewBaseItem = (category: Category): TreeViewBaseItem => ({
  id: category.id.toString(),
  label: category.name,
  children: category.children.map(categoryToTreeViewBaseItem),
});

const selectionPropagation: TreeViewSelectionPropagation = {
  parents: true,
  descendants: true,
};

export type CategoryTreeProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function CategoryTree({
  productsState,
  productsDispatch,
}: CategoryTreeProps) {
  const theme = useTheme();
  const categoriesTree = useAppSelector(selectCategoriesTree);
  const categoryTreeItems = useMemo<TreeViewBaseItem[]>(() => categoriesTree.map(categoryToTreeViewBaseItem), [categoriesTree]);
  const selectedItems: string[] = productsState.query.categoryIds.map((id) => id.toString());
  const initialSelectedItems = useApplyPropagationToSelectedItemsOnMount({
    items: categoryTreeItems,
    selectionPropagation: selectionPropagation,
    selectedItems,
  });

  // get categories if not already fetched
  useGetCategoryTreesQuery();

  useEffect(() => {
    productsDispatch({
      type: "SET_CATEGORIES",
      payload: initialSelectedItems.map(parseInt),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedItemsChange: UseTreeViewSelectionParameters<true>["onSelectedItemsChange"] = (event, itemIds) => {
    productsDispatch({
      type: "SET_CATEGORIES",
      payload: itemIds.map(parseInt),
    });
  };

  return (
    <RichTreeView
      items={categoryTreeItems}
      multiSelect
      checkboxSelection
      selectionPropagation={selectionPropagation}
      selectedItems={selectedItems}
      sx={{
        width: "max-content",
        minWidth: "100%",
        [`.${richTreeViewClasses.itemLabel}`]: {
          ...theme.typography.body2,
        },
      }}
      slotProps={{
        item: {
          slotProps: {
            checkbox: {
              size: "small",
            } as CheckboxProps as ButtonBaseProps,
          },
        },
      }}
      onSelectedItemsChange={handleSelectedItemsChange}
    />
  );
}

export default CategoryTree;
