import React from "react";
import { Route } from "react-router-dom";

const HomePage = React.lazy(() => import("@/modules/Main/pages/HomePage"));
const PrivacyPage = React.lazy(() => import("@/modules/Main/pages/PrivacyPage"));

const MainRoute = [
  <Route key="home" index element={<HomePage />} />,
  <Route key="privacy" path="privacy" element={<PrivacyPage />} />,
];

export default MainRoute;
