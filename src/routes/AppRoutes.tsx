import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import MainRoute from "./MainRoute";
import AdminRoute from "./admin";

export default function AppRoutes() {
  const { t } = useTranslation();

  return (
    <Routes>
      {MainRoute}
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
