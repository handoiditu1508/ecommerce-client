import { useConfirmChangeEmailMutation } from "@/redux/apis/authApi";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";

function ConfirmChangeEmailPage() {
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const newEmail = searchParams.get("newEmail");
  const token = searchParams.get("token");
  const [confirmChangeEmail, { isLoading, isSuccess, isError }] = useConfirmChangeEmailMutation();

  useEffect(() => {
    const id = Number(userId);

    if (!isNaN(id) && newEmail && token) {
      confirmChangeEmail({
        userId: id,
        newEmail,
        token,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, newEmail, token]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        mt: 10,
        px: 2,
      }}
    >
      {isLoading && <CircularProgress />}
      {isError && <>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 100 }} />
        <Typography variant="h4">{t("error")}</Typography>
        <Typography variant="body1" color="text.secondary">
          {tAccount("email_confirm_failed_message")}
        </Typography>
        <Button component={Link} to="/account/security" variant="contained" sx={{ mt: 2 }}>
          {tAccount("back_to_security")}
        </Button>
      </>}
      {isSuccess && <>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 100 }} />
        <Typography variant="h4">{t("update_success", { name: "email" })}</Typography>
        <Typography variant="body1" color="text.secondary">
          {tAccount("email_confirm_success_message")}
        </Typography>
        <Button component={Link} to="/account/security" variant="contained" sx={{ mt: 2 }}>
          {tAccount("back_to_security")}
        </Button>
      </>}
    </Box>
  );
}

export default ConfirmChangeEmailPage;
