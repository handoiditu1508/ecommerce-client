import Policy from "@/models/Policy";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const BrandsPage = React.lazy(() => import("@/modules/admin/brand/pages/BrandsPage"));

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
    ],
  },
];

export default brandRoutes;
