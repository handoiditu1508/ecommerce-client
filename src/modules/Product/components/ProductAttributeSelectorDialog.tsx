import { BreakpointsContext } from "@/contexts/breakpoints";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import React, { useContext, useId } from "react";
import ProductAttributeSelector from "./ProductAttributeSelector/ProductAttributeSelector";

type ProductAttributeSelectorDialogProps = {
  open: boolean;
  confirmButtonText?: string;
  onClose: () => void;
};

const Transition = (props: TransitionProps & {
  children: React.ReactElement<any, any>;
  ref?: React.Ref<HTMLElement>;
}) => {
  return <Slide direction="up" {...props} />;
};

function ProductAttributeSelectorDialog({
  open,
  confirmButtonText = "Confirm",
  onClose,
}: ProductAttributeSelectorDialogProps) {
  const dialogLabelId = useId();
  const theme = useTheme();
  const { smAndDown } = useContext(BreakpointsContext);

  return (
    <Dialog
      open={open}
      fullScreen={smAndDown}
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby={dialogLabelId}
      slots={{
        transition: Transition,
      }}
      onClose={onClose}>
      <DialogTitle id={dialogLabelId}>Select product attributes</DialogTitle>
      <IconButton
        aria-label="close"
        color="default"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.vars.palette.grey["500"],
        }}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <ProductAttributeSelector />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{confirmButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductAttributeSelectorDialog;
