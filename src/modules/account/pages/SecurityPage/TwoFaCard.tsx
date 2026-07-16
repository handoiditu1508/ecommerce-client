import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { useSet2FaMutation } from "@/redux/apis/authApi";
import { authSelectors } from "@/redux/slices/authSlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function TwoFaCard() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const authUser = useAppSelector(authSelectors.user);
  const [set2fa, set2faResult] = useSet2FaMutation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [targetEnabled, setTargetEnabled] = useState<boolean | null>(null);

  const handleToggle2fa = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTargetEnabled(checked);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConfirmPassword("");
    setTargetEnabled(null);
  };

  const handleConfirmToggle = async () => {
    try {
      if (targetEnabled === null) return;
      await set2fa({
        enabled: targetEnabled,
        password: confirmPassword,
      }).unwrap();
      dispatch(pushNotification({
        text: t("update_success", { name: "2FA" }),
        severity: "success",
      }));
    } catch {
    } finally {
      handleCloseDialog();
    }
  };

  return authUser && (
    <>
      <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>{tAccount("two_factor_authentication")} (2FA)</Typography>
          <FormControlLabel
            control={<Switch checked={authUser.twoFactorEnabled} onChange={handleToggle2fa} />}
            disabled={(!authUser.twoFactorEnabled && !authUser.emailConfirmed) || set2faResult.isLoading}
            label={tAccount("enable_2fa")}
          />
          {!authUser.twoFactorEnabled && !authUser.emailConfirmed && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {tAccount("confirm_email_first")}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{targetEnabled ? tAccount("enable") : tAccount("disable")} 2FA</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {targetEnabled
              ? `To ${tAccount("enable").toLowerCase()} two-factor authentication, please enter your password to confirm.`
              : `To ${tAccount("disable").toLowerCase()} two-factor authentication, please enter your password to confirm.`}
          </DialogContentText>
          <TextField autoFocus fullWidth label={tAccount("password")} type="password" variant="outlined" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>{tAccount("cancel")}</Button>
          <Button color={targetEnabled ? "primary" : "error"} disabled={!confirmPassword} loading={set2faResult.isLoading} onClick={handleConfirmToggle}>
            {targetEnabled ? tAccount("enable") : tAccount("disable")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TwoFaCard;
