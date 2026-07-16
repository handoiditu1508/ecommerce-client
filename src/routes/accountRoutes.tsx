import Policy from "@/models/Policy";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SecurityIcon from "@mui/icons-material/Security";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const SettingLayout = React.lazy(() => import("@/modules/account/pages/SettingLayout"));
const ProfilePage = React.lazy(() => import("@/modules/account/pages/ProfilePage"));
const SecurityPage = React.lazy(() => import("@/modules/account/pages/SecurityPage"));
const ConfirmChangeEmailPage = React.lazy(() => import("@/modules/account/pages/ConfirmChangeEmailPage"));

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
          policies: [
            Policy.UpdateSelf,
          ],
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
          policies: [
            Policy.UpdateSelf,
          ],
        } as RouteHandleObject,
      },
    ],
  },
  {
    path: "confirm-change-email/:userId",
    element: <ConfirmChangeEmailPage />,
  },
];

export default accountRoutes;
