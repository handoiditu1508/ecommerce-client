import Policy from "@/models/Policy";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const BrandsPage = React.lazy(() => import("@/modules/admin/brand/pages/BrandsPage"));
const CreateBrandPage = React.lazy(() => import("@/modules/admin/brand/pages/CreateBrandPage"));
const UpdateBrandPage = React.lazy(() => import("@/modules/admin/brand/pages/UpdateBrandPage"));

const brandRoutes: RouteObject[] = [
  {
    path: "brands",
    handle: {
      crumb: { label: "Brands", icon: <BrandingWatermarkIcon />, to: "/admin/brands" },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <BrandsPage />,
        handle: { policies: [Policy.ViewBrand] } as RouteHandleObject,
      },
      {
        path: "new",
        element: <CreateBrandPage />,
        handle: {
          crumb: { label: "Create brand", icon: <LibraryAddIcon /> },
          policies: [Policy.CreateBrand],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdateBrandPage />,
        handle: {
          crumb: { label: "Update brand", icon: <EditIcon /> },
          policies: [Policy.UpdateBrand],
        } as RouteHandleObject,
      },
    ],
  },
];

export default brandRoutes;
