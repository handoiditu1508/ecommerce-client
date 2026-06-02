import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const SettingLayout = React.lazy(() => import("@/modules/account/pages/SettingLayout"));
const ChangeEmailPage = React.lazy(() => import("@/modules/account/pages/ChangeEmailPage"));
const ChangePasswordPage = React.lazy(() => import("@/modules/account/pages/ChangePasswordPage"));
const ProfilePage = React.lazy(() => import("@/modules/account/pages/ProfilePage"));

const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: <SettingLayout />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <ProfilePage />,
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

export default accountRoutes;
