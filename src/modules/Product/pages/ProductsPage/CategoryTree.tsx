import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { CheckboxProps } from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { useApplyPropagationToSelectedItemsOnMount } from "@mui/x-tree-view/hooks";
import { UseTreeViewSelectionParameters } from "@mui/x-tree-view/internals";
import { TreeViewBaseItem, TreeViewSelectionPropagation } from "@mui/x-tree-view/models";
import { RichTreeView, richTreeViewClasses } from "@mui/x-tree-view/RichTreeView";
import { useState } from "react";

const categoryTreeItems: TreeViewBaseItem[] = [
  {
    id: "hat",
    label: "Hat",
    children: [
      {
        id: "baseball-cap",
        label: "Baseball Cap",
      },
      {
        id: "beanie",
        label: "Beanie",
      },
    ],
  },
  {
    id: "jacket",
    label: "Jacket",
    children: [
      {
        id: "bomber-jacket",
        label: "Bomber Jacket",
      },
      {
        id: "denim-jacket",
        label: "Denim Jacket",
        children: [
          {
            id: "black-denim-jacket",
            label: "Black Denim Jacket",
          },
          {
            id: "blue-denim-jacket",
            label: "Blue Denim Jacket",
          },
        ],
      },
    ],
  },
  {
    id: "shirt",
    label: "Shirt",
    children: [
      {
        id: "polo-shirt",
        label: "Polo Shirt",
      },
      {
        id: "t-shirt",
        label: "T-Shirt",
      },
    ],
  },
];

const selectionPropagation: TreeViewSelectionPropagation = {
  parents: true,
  descendants: true,
};

function CategoryTree() {
  const theme = useTheme();
  const initialSelectedItems = useApplyPropagationToSelectedItemsOnMount({
    items: categoryTreeItems,
    selectionPropagation: selectionPropagation,
    selectedItems: ["bomber-jacket", "denim-jacket"],
  });
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const handleSlectedItemsChange: UseTreeViewSelectionParameters<true>["onSelectedItemsChange"] = (event, itemIds) => {
    setSelectedItems(itemIds);
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
      onSelectedItemsChange={handleSlectedItemsChange}
    />
  );
}

export default CategoryTree;
