import Suspense from "@/components/Suspense";
import React from "react";
import { Route } from "react-router-dom";
import MainRoute from "./MainRoute";

const AdminLayout = React.lazy(() => import("@/layouts/AdminLayout"));

const AdminRoute = (
  <Route path="admin">
    <Route element={<Suspense><AdminLayout /></Suspense>}>
      {MainRoute}
    </Route>
  </Route>
);

export default AdminRoute;
