import Suspense from "@/components/Suspense";
import React from "react";
import { Route } from "react-router-dom";

const ClientLayout = React.lazy(() => import("@/layouts/ClientLayout"));
const HomePage = React.lazy(() => import("@/modules/Main/pages/HomePage"));

const MainRoute = [
  <Route key="client-layout" element={<Suspense><ClientLayout /></Suspense>}>
    <Route index element={<HomePage />} />,
  </Route>,
];

export default MainRoute;
