import React from "react";
import { Route } from "react-router-dom";

const ChangeEmailPage = React.lazy(() => import("@/modules/User/pages/ChangeEmailPage"));
const ChangePasswordPage = React.lazy(() => import("@/modules/User/pages/ChangePasswordPage"));
const UserSettingPage = React.lazy(() => import("@/modules/User/pages/UserSettingPage"));

const UserRoute = [
  <Route key="change-email" path="user/change-email" element={<ChangeEmailPage />} />,
  <Route key="change-password" path="user/change-password" element={<ChangePasswordPage />} />,
  <Route key="user-setting" path="user" element={<UserSettingPage />} />,
];

export default UserRoute;
