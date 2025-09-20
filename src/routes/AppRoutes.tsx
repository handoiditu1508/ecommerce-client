import Suspense from "@/components/Suspense";
import EmptyLayout from "@/layouts/EmptyLayout";
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./admin";
import AuthRoute from "./AuthRoute";
import MainRoute from "./MainRoute";
import ProductRoute from "./ProductRoute";
import UserRoute from "./UserRoute";

const ClientLayout = React.lazy(() => import("@/layouts/ClientLayout"));

export default function AppRoutes() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route element={<EmptyLayout />}>
        {AuthRoute}
      </Route>
      <Route element={<Suspense><ClientLayout /></Suspense>}>
        {MainRoute}
        {ProductRoute}
        {UserRoute}
      </Route>
      {AdminRoute}
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>{t("There's nothing here!")}</p>
          </main>
        }
      />
    </Routes>
  );
}
