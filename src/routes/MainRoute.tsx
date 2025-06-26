import React from "react";
import { Route } from "react-router-dom";

const MainModule = React.lazy(() => import("@/modules/Main"));
const HomePage = React.lazy(() => import("@/modules/Main/pages/HomePage"));

const MainRoute = (
  <Route element={<MainModule />}>
    <Route index element={<HomePage />} />
  </Route>
);

export default MainRoute;
