import Policy from "@/models/Policy";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const GiftsPage = React.lazy(() => import("@/modules/admin/gift/pages/GiftsPage"));
const CreateGiftPage = React.lazy(() => import("@/modules/admin/gift/pages/CreateGiftPage"));
const UpdateGiftPage = React.lazy(() => import("@/modules/admin/gift/pages/UpdateGiftPage"));

const giftRoutes: RouteObject[] = [
  {
    path: "gifts",
    handle: {
      crumb: { label: "Gifts", icon: <CardGiftcardIcon />, to: "/admin/gifts" },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <GiftsPage />,
        handle: { policies: [Policy.ViewGift] } as RouteHandleObject,
      },
      {
        path: "new",
        element: <CreateGiftPage />,
        handle: {
          crumb: { label: "Create gift", icon: <AddCircleIcon /> },
          policies: [Policy.CreateGift],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdateGiftPage />,
        handle: {
          crumb: { label: "Update gift", icon: <EditIcon /> },
          policies: [Policy.UpdateGift],
        } as RouteHandleObject,
      },
    ],
  },
];

export default giftRoutes;
