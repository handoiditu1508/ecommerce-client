import Policy from "@/models/Policy";
import CategoryIcon from "@mui/icons-material/Category";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const CategoriesPage = React.lazy(() => import("@/modules/admin/category/pages/CategoriesPage"));
const CreateCategoryPage = React.lazy(() => import("@/modules/admin/category/pages/CreateCategoryPage"));
const UpdateCategoryPage = React.lazy(() => import("@/modules/admin/category/pages/UpdateCategoryPage"));

const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    handle: {
      crumb: { label: "Categories", icon: <CategoryIcon />, to: "/admin/categories" },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <CategoriesPage />,
        handle: { policies: [Policy.ViewCategory] } as RouteHandleObject,
      },
      {
        path: "new",
        element: <CreateCategoryPage />,
        handle: {
          crumb: { label: "Create category", icon: <CreateNewFolderIcon /> },
          policies: [Policy.CreateCategory],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdateCategoryPage />,
        handle: {
          crumb: { label: "Update category", icon: <EditIcon /> },
          policies: [Policy.UpdateCategory],
        } as RouteHandleObject,
      },
    ],
  },
];

export default categoryRoutes;
