import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { ProductVariant } from "@/models/entities/Product";
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
import React, { Dispatch, useContext, useId, useState } from "react";
import ProductVariantSelector from "./ProductVariantSelector/ProductVariantSelector";

type ProductVariantSelectorDialogProps = {
  open: boolean;
  variants: ProductVariant[];
  confirmButtonText?: string;
  defaultVariantId?: number;
  onChange?: Dispatch<number>;
  onClose: () => void;
};

const Transition = (props: TransitionProps & {
  children: React.ReactElement<any, any>;
  ref?: React.Ref<HTMLElement>;
}) => {
  return <Slide direction="up" {...props} />;
};

function ProductVariantSelectorDialog({
  open,
  variants,
  confirmButtonText = "Confirm",
  defaultVariantId,
  onChange = CONFIG.EMPTY_FUNCTION,
  onClose,
}: ProductVariantSelectorDialogProps) {
  const dialogLabelId = useId();
  const theme = useTheme();
  const { smAndDown } = useContext(BreakpointsContext);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(defaultVariantId);

  const handleConfirm = () => {
    if (selectedVariantId) {
      onChange(selectedVariantId);
    }
    onClose();
  };

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
        <ProductVariantSelector variants={variants} defaultVariantId={defaultVariantId} onChange={setSelectedVariantId} />
      </DialogContent>
      <DialogActions>
        <Button disabled={selectedVariantId === undefined} onClick={handleConfirm}>{confirmButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductVariantSelectorDialog;
