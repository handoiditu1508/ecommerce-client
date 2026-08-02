import Suspense from "@/components/Suspense";
import React from "react";
import { RouteObject } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import productRoutes from "./productRoutes";
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
          ...userRoutes,
        ],
      },
    ],
  },
];

export default adminRoutes;
