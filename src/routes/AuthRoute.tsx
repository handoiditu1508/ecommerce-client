import Suspense from "@/components/Suspense";
import React from "react";
import { Route } from "react-router-dom";

const ForgotPasswordPage = React.lazy(() => import("@/modules/Auth/pages/ForgotPasswordPage"));
const LoginPage = React.lazy(() => import("@/modules/Auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/modules/Auth/pages/RegisterPage"));

const AuthRoute = [
  <Route key="forgot-password" path="forgot-password" element={<Suspense><ForgotPasswordPage /></Suspense>} />,
  <Route key="login" path="login" element={<Suspense><LoginPage /></Suspense>} />,
  <Route key="register" path="register" element={<Suspense><RegisterPage /></Suspense>} />,
];

export default AuthRoute;
