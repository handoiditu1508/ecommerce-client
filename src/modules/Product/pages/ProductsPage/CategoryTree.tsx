import { distinct } from "@/common/array";
import { useAppSelector } from "@/hooks";
import Category from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { RootState } from "@/redux/store";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { CheckboxProps } from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { useApplyPropagationToSelectedItemsOnMount } from "@mui/x-tree-view/hooks";
import { UseTreeViewSelectionParameters } from "@mui/x-tree-view/internals";
import { TreeViewBaseItem, TreeViewSelectionPropagation } from "@mui/x-tree-view/models";
import { RichTreeView, richTreeViewClasses } from "@mui/x-tree-view/RichTreeView";
import { createSelector } from "@reduxjs/toolkit";
import { ActionDispatch, useEffect, useMemo, useState } from "react";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

const categoryToTreeViewBaseItem = (category: Category): TreeViewBaseItem => ({
  id: category.id.toString(),
  label: category.name,
  children: category.children.map(categoryToTreeViewBaseItem),
});

const selectDefaultExpandedItems = createSelector(
  [
    (state: RootState) => state.category.entities,
    (_state: RootState, initialSelectedItems: string[]) => initialSelectedItems,
  ],
  (categories, initialSelectedItems) =>
    distinct(initialSelectedItems.flatMap((id) => categories[id as unknown as number]?.ancestorIds ?? [])).map((id) => id.toString()),
);

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
  const categoriesTree = useAppSelector(categorySelectors.tree);
  const categoryTreeItems = useMemo<TreeViewBaseItem[]>(() => categoriesTree.map(categoryToTreeViewBaseItem), [categoriesTree]);
  const selectedItems: string[] = productsState.categoryIds.map((id) => id.toString());
  const initialSelectedItems = useApplyPropagationToSelectedItemsOnMount({
    items: categoryTreeItems,
    selectionPropagation: selectionPropagation,
    selectedItems,
  });
  const defaultExpandedItems = useAppSelector((state) => selectDefaultExpandedItems(state, initialSelectedItems));
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpandedItems);

  // get categories if not already fetched
  useGetCategoryTreesQuery();

  useEffect(() => {
    productsDispatch({
      type: "SET_CATEGORIES",
      payload: initialSelectedItems.map((id) => parseInt(id)),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedItemsChange: UseTreeViewSelectionParameters<true>["onSelectedItemsChange"] = (event, itemIds) => {
    productsDispatch({
      type: "SET_CATEGORIES",
      payload: itemIds.map((id) => parseInt(id)),
    });
  };

  return (
    <RichTreeView
      items={categoryTreeItems}
      multiSelect
      checkboxSelection
      selectionPropagation={selectionPropagation}
      selectedItems={selectedItems}
      expandedItems={expandedItems}
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
      onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
    />
  );
}

export default CategoryTree;
