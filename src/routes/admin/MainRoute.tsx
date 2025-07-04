import React from "react";
import { Route } from "react-router-dom";

const DashboardPage = React.lazy(() => import("@/modules/admin/Main/pages/DashboardPage"));

const MainRoute = [
  <Route key="dashboard" index element={<DashboardPage />} />,
];

export default MainRoute;
