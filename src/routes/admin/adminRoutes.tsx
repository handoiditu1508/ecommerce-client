import Suspense from "@/components/Suspense";
import React from "react";
import { RouteObject } from "react-router-dom";
import brandRoutes from "./brandRoutes";
import categoryRoutes from "./categoryRoutes";
import giftRoutes from "./giftRoutes";
import mainRoutes from "./mainRoutes";
import productRoutes from "./productRoutes";
import promotionRoutes from "./promotionRoutes";
import userRoutes from "./userRoutes";

const AdminLayout = React.lazy(() => import("@/layouts/AdminLayout"));

const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    children: [
      {
        element: <Suspense><AdminLayout /></Suspense>,
        children: [
          ...mainRoutes,
          ...productRoutes,
          ...categoryRoutes,
          ...brandRoutes,
          ...userRoutes,
          ...promotionRoutes,
          ...giftRoutes,
        ],
      },
    ],
  },
];

export default adminRoutes;
