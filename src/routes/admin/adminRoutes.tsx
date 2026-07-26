import Suspense from "@/components/Suspense";
import React from "react";
import { RouteObject } from "react-router-dom";
import mainRoutes from "./mainRoutes";
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
          ...userRoutes,
        ],
      },
    ],
  },
];

export default adminRoutes;
