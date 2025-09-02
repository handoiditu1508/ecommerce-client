import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext } from "react";
import CancelReason from "./CancelReason";
import ConfirmationDialogContext from "./ConfirmationDialogContext";

function ConfirmationDialog(props: Omit<DialogProps, "open">) {
  const {
    open,
    loading,
    title,
    description,
    cancelButtonText,
    confirmButtonText,
    hideCancelButton,
    preventCloseOnConfirm,
    onCancel,
    onConfirm,
    closeDialog,
  } = useContext(ConfirmationDialogContext);

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await onConfirm();
    if (!preventCloseOnConfirm) {
      closeDialog();
    }
  };

  const handleCancel = async (_: {}, reason: CancelReason) => {
    if (!loading) {
      await onCancel(reason);
      closeDialog();
    }
  };

  return (
    <Dialog {...props} open={open} disableEscapeKeyDown={loading} onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        {!hideCancelButton && <Button
          variant="outlined"
          disabled={loading}
          onClick={(event) => handleCancel(event, "cancelButton")}>
          {cancelButtonText}
        </Button>}
        <LoadingButton variant="contained" loading={loading} onClick={handleConfirm}><span>{confirmButtonText}</span></LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
