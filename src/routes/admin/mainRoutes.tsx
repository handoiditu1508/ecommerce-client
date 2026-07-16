import Policy from "@/models/Policy";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const DashboardPage = React.lazy(() => import("@/modules/admin/main/pages/DashboardPage"));

const mainRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
    handle: {
      hideBreadcrumbs: true,
      policies: [
        Policy.Admin,
      ],
    } as RouteHandleObject,
  },
];

export default mainRoutes;
