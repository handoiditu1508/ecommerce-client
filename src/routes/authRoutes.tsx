import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const ForgotPasswordPage = React.lazy(() => import("@/modules/Auth2/pages/ForgotPasswordPage"));
const LoginPage = React.lazy(() => import("@/modules/Auth2/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/modules/Auth2/pages/RegisterPage"));

const authRoutes: RouteObject[] = [
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
  },
  {
    path: "login",
    element: <LoginPage />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
  },
  {
    path: "register",
    element: <RegisterPage />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
  },
];

export default authRoutes;
