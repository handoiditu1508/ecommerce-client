type ConfirmationDialogOptions = {
  description?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  hideCancelButton?: boolean;
  onCancel?: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;
  preventCloseOnConfirm?: boolean;
};

export default ConfirmationDialogOptions;
