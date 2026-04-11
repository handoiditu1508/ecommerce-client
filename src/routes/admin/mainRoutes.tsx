import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const DashboardPage = React.lazy(() => import("@/modules/admin/Main/pages/DashboardPage"));

const mainRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
  },
];

export default mainRoutes;
