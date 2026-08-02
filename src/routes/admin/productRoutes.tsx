import Policy from "@/models/Policy";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const CreateProductPage = React.lazy(() => import("@/modules/admin/product/pages/CreateProductPage"));
const UpdateProductPage = React.lazy(() => import("@/modules/admin/product/pages/UpdateProductPage"));
const productRoutes: RouteObject[] = [
  {
    path: "products",
    handle: {
      crumb: {
        label: "Products",
        icon: <Inventory2Icon />,
        to: "/admin/products",
      },
    } as RouteHandleObject,
    children: [
      {
        path: "new",
        element: <CreateProductPage />,
        handle: {
          crumb: {
            label: "Create product",
            icon: <AddShoppingCartIcon />,
          },
          policies: [Policy.CreateProduct],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdateProductPage />,
        handle: {
          crumb: {
            label: "Update product",
            icon: <EditIcon />,
          },
          policies: [Policy.UpdateProduct],
        } as RouteHandleObject,
      },
    ],
  },
];

export default productRoutes;
