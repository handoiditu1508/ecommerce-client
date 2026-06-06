import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ForbiddenPage() {
  const { t } = useTranslation();

  return (
    <main style={{ padding: "1rem" }}>
      <Typography variant="h2">Forbidden</Typography>
      <Typography variant="body1">{t("page_restricted_message")}</Typography>
      <Button variant="text" component={Link} to="/">{t("back_to_home_page")}</Button>
    </main>
  );
}

export default ForbiddenPage;
