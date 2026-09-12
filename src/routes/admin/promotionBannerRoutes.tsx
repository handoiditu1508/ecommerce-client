import Policy from "@/models/Policy";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const PromotionBannersPage = React.lazy(() => import("@/modules/admin/promotionBanner/pages/PromotionBannersPage"));
const CreatePromotionBannerPage = React.lazy(() => import("@/modules/admin/promotionBanner/pages/CreatePromotionBannerPage"));
const UpdatePromotionBannerPage = React.lazy(() => import("@/modules/admin/promotionBanner/pages/UpdatePromotionBannerPage"));

const promotionBannerRoutes: RouteObject[] = [
  {
    path: "promotion-banners",
    handle: {
      crumb: { label: "Promotion banners", icon: <ViewCarouselIcon />, to: "/admin/promotion-banners" },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <PromotionBannersPage />,
        handle: { policies: [Policy.ViewPromotionBanner] } as RouteHandleObject,
      },
      {
        path: "new",
        element: <CreatePromotionBannerPage />,
        handle: {
          crumb: { label: "Create promotion banner", icon: <AddCircleIcon /> },
          policies: [Policy.CreatePromotionBanner],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdatePromotionBannerPage />,
        handle: {
          crumb: { label: "Update promotion banner", icon: <EditIcon /> },
          policies: [Policy.UpdatePromotionBanner],
        } as RouteHandleObject,
      },
    ],
  },
];

export default promotionBannerRoutes;
