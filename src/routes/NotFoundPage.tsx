import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main style={{ padding: "1rem" }}>
      <p>{t("page_not_found_message")}</p>
    </main>
  );
}

export default NotFoundPage;
