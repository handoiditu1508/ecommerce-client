import React from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const ChangeEmailPage = React.lazy(() => import("@/modules/User/pages/ChangeEmailPage"));
const ChangePasswordPage = React.lazy(() => import("@/modules/User/pages/ChangePasswordPage"));
const UserSettingPage = React.lazy(() => import("@/modules/User/pages/UserSettingPage"));

const userRoutes: RouteObject[] = [
  {
    path: "user",
    element: <Outlet />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <UserSettingPage />,
      },
      {
        path: "change-email",
        element: <ChangeEmailPage />,
        handle: {
          hideBreadcrumbs: true,
        } as RouteHandleObject,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        handle: {
          hideBreadcrumbs: true,
        } as RouteHandleObject,
      },
    ],
  },
];

export default userRoutes;
