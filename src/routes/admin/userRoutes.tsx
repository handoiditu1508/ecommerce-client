import Policy from "@/models/Policy";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const UsersPage = React.lazy(() => import("@/modules/admin/user/pages/UsersPage"));
const CreateUserPage = React.lazy(() => import("@/modules/admin/user/pages/CreateUserPage"));
const UpdateUserPage = React.lazy(() => import("@/modules/admin/user/pages/UpdateUserPage"));

const userRoutes: RouteObject[] = [
  {
    path: "users",
    handle: {
      crumb: { label: "Users", icon: <PeopleIcon />, to: "/admin/users" },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <UsersPage />,
        handle: { policies: [Policy.ViewUser] } as RouteHandleObject,
      },
      {
        path: "new",
        element: <CreateUserPage />,
        handle: {
          crumb: { label: "Create user", icon: <PersonAddIcon /> },
          policies: [Policy.CreateUser],
        } as RouteHandleObject,
      },
      {
        path: ":id",
        element: <UpdateUserPage />,
        handle: {
          crumb: { label: "Update user", icon: <ManageAccountsIcon /> },
          policies: [Policy.UpdateUser],
        } as RouteHandleObject,
      },
    ],
  },
];

export default userRoutes;
