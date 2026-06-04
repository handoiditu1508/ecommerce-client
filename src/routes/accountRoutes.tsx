import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SecurityIcon from "@mui/icons-material/Security";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const SettingLayout = React.lazy(() => import("@/modules/account/pages/SettingLayout"));
const ChangeEmailPage = React.lazy(() => import("@/modules/account/pages/ChangeEmailPage"));
const ChangePasswordPage = React.lazy(() => import("@/modules/account/pages/ChangePasswordPage"));
const ProfilePage = React.lazy(() => import("@/modules/account/pages/ProfilePage"));
const SecurityPage = React.lazy(() => import("@/modules/account/pages/SecurityPage"));

const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: <SettingLayout />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
        handle: {
          crumb: {
            icon: <ManageAccountsIcon />,
            to: "/account",
            label: "Profile",
          },
        } as RouteHandleObject,
      },
      {
        path: "change-email",
        element: <ChangeEmailPage />,
        handle: {
          crumb: {
            icon: <ManageAccountsIcon />,
            to: "/account/change-email",
            label: "Change Email",
          },
        } as RouteHandleObject,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        handle: {
          crumb: {
            icon: <ManageAccountsIcon />,
            to: "/account/change-password",
            label: "Change Password",
          },
        } as RouteHandleObject,
      },
      {
        path: "security",
        element: <SecurityPage />,
        handle: {
          crumb: {
            icon: <SecurityIcon />,
            to: "/account/security",
            label: "Security",
          },
        } as RouteHandleObject,
      },
    ],
  },
];

export default accountRoutes;
