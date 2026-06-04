import useAppSelector from "@/hooks/useAppSelector";
import { useSet2FaMutation } from "@/redux/apis/authApi";
import { authSelectors } from "@/redux/slices/authSlice";
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

function TwoFaCard() {
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
    if (targetEnabled === null) return;

    await set2fa({
      enabled: targetEnabled,
      password: confirmPassword,
    }).unwrap();

    handleCloseDialog();
  };

  return authUser && (
    <>
      <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Two-Factor Authentication (2FA)</Typography>
          <FormControlLabel
            control={<Switch checked={authUser.twoFactorEnabled} onChange={handleToggle2fa} />}
            disabled={(!authUser.twoFactorEnabled && !authUser.emailConfirmed) || set2faResult.isLoading}
            label="Enable 2FA"
          />
          {!authUser.twoFactorEnabled && !authUser.emailConfirmed && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Please confirm your email before enabling 2FA.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{targetEnabled ? "Enable" : "Disable"} 2FA</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To {targetEnabled ? "enable" : "disable"} two-factor authentication, please enter your password to confirm.
          </DialogContentText>
          <TextField autoFocus fullWidth label="Password" type="password" variant="outlined" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color={targetEnabled ? "primary" : "error"} disabled={!confirmPassword} loading={set2faResult.isLoading} onClick={handleConfirmToggle}>
            {targetEnabled ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TwoFaCard;
