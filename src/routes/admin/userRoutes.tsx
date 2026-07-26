import Policy from "@/models/Policy";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const UsersPage = React.lazy(() => import("@/modules/admin/user/pages/UsersPage"));
const CreateUserPage = React.lazy(() => import("@/modules/admin/user/pages/CreateUserPage"));
const UpdateUserPage = React.lazy(() => import("@/modules/admin/user/pages/UpdateUserPage"));

const userRoutes: RouteObject[] = [
  { path: "users", element: <UsersPage />, handle: { crumb: { label: "Users", to: "/admin/users" }, policies: [Policy.ViewUser] } as RouteHandleObject },
  { path: "users/new", element: <CreateUserPage />, handle: { crumb: { label: "Create user" }, policies: [Policy.CreateUser] } as RouteHandleObject },
  { path: "users/:id", element: <UpdateUserPage />, handle: { crumb: { label: "Update user" }, policies: [Policy.UpdateUser] } as RouteHandleObject },
];

export default userRoutes;
