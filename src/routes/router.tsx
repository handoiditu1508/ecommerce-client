import AppProvider from "@/AppProvider";
import Suspense from "@/components/Suspense";
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./admin";
import authRoutes from "./authRoutes";
import mainRoutes from "./mainRoutes";

const ClientLayout = React.lazy(() => import("@/layouts/ClientLayout"));
const AuthLayout = React.lazy(() => import("@/layouts/AuthLayout"));
const ForbiddenPage = React.lazy(() => import("./ForbiddenPage"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));

const router = createBrowserRouter([
  {
    element: <AppProvider />,
    children: [
      {
        element: <Suspense><AuthLayout /></Suspense>,
        children: authRoutes,
      },
      {
        element: <Suspense><ClientLayout /></Suspense>,
        children: mainRoutes,
      },
      ...adminRoutes,
      {
        path: "403",
        element: <ForbiddenPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
