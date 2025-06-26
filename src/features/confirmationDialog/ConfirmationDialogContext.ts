import React from "react";
import CancelReason from "./CancelReason";
import ConfirmationDialogOptions from "./ConfirmationDialogOptions";

export type ConfirmationDialogContextType = {
  openDialog: (title: string, options?: ConfirmationDialogOptions) => void;
  closeDialog: () => void;
  setLoading: (loading: boolean) => void;
  open: boolean;
  loading: boolean;
  title: string;
  description?: string;
  cancelButtonText: string;
  confirmButtonText: string;
  hideCancelButton: boolean;
  onCancel: (reason: CancelReason) => void | Promise<void>;
  onConfirm: () => void | Promise<void>;
  preventCloseOnConfirm: boolean;
};

const ConfirmationDialogContext = React.createContext<ConfirmationDialogContextType>({} as ConfirmationDialogContextType);

export default ConfirmationDialogContext;
