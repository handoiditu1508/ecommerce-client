import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import { Outlet, RouteObject } from "react-router-dom";
import accountRoutes from "./accountRoutes";
import { RouteHandleObject } from "./models";
import productRoutes from "./productRoutes";

const HomePage = React.lazy(() => import("@/modules/main/pages/HomePage"));
const PrivacyPage = React.lazy(() => import("@/modules/main/pages/PrivacyPage"));

const mainRoutes: RouteObject[] = [
  {
    element: <Outlet />,
    handle: {
      crumb: {
        to: "/",
        icon: <HomeIcon />,
      },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: {
          hideBreadcrumbs: true,
        } as RouteHandleObject,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
        handle: {
          crumb: {
            to: "/privacy",
            label: "Privacy Policy",
          },
          hideBreadcrumbs: false,
        } as RouteHandleObject,
      },
      ...productRoutes,
      ...accountRoutes,
    ],
  },
];

export default mainRoutes;
