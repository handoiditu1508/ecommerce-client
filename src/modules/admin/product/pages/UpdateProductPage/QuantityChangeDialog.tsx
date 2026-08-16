import useAppDispatch from "@/hooks/useAppDispatch";
import { ProductVariant } from "@/models/entities/Product";
import { useAddProductQuantityMutation } from "@/redux/apis/productApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type QuantityChangeType = "increase" | "decrease";

export type QuantityChangeDialogState = {
  type: QuantityChangeType;
  variant: Pick<ProductVariant, "id" | "name" | "quantity">;
};

type QuantityChangeDialogProps = {
  productId: number;
  quantityChange: QuantityChangeDialogState | null;
  onClose: () => void;
};

function QuantityChangeDialog({ productId, quantityChange, onClose }: QuantityChangeDialogProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("admin-product");
  const [addProductQuantity, addProductQuantityResult] = useAddProductQuantityMutation();
  const [quantityChangeAmount, setQuantityChangeAmount] = useState("");
  const quantityChangeAmountAsNumber = Number(quantityChangeAmount);
  const isQuantityChangeAmountValid = /^\d+$/.test(quantityChangeAmount)
    && Number.isSafeInteger(quantityChangeAmountAsNumber)
    && quantityChangeAmountAsNumber > 0;
  const futureQuantity = quantityChange && isQuantityChangeAmountValid
    ? quantityChange.variant.quantity + (
      quantityChange.type === "increase" ? quantityChangeAmountAsNumber : -quantityChangeAmountAsNumber
    )
    : undefined;
  const isFutureQuantityValid = futureQuantity === undefined || futureQuantity >= 0;
  const isQuantityChangeValid = isQuantityChangeAmountValid && isFutureQuantityValid;

  useEffect(() => {
    setQuantityChangeAmount("");
  }, [quantityChange]);

  const handleClose = () => {
    if (!addProductQuantityResult.isLoading) onClose();
  };

  const handleSubmit = async () => {
    if (!quantityChange || !isQuantityChangeValid) return;

    try {
      await addProductQuantity({
        productId,
        productVariantId: quantityChange.variant.id,
        additionalQuantity: quantityChange.type === "increase"
          ? quantityChangeAmountAsNumber
          : -quantityChangeAmountAsNumber,
      }).unwrap();
      dispatch(pushNotification({
        text: t("product_quantity_updated_successfully"),
        severity: "success",
      }));
      onClose();
    } catch {}
  };

  return (
    <Dialog
      open={quantityChange !== null}
      disableEscapeKeyDown={addProductQuantityResult.isLoading}
      fullWidth
      maxWidth="xs"
      onClose={handleClose}>
      <DialogTitle>
        {quantityChange?.type === "increase" ? t("increase_quantity") : t("decrease_quantity")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("quantity_change_for_variant", { name: quantityChange?.variant.name })}
        </DialogContentText>
        <Typography sx={{ mt: 1 }}>
          {t("current_quantity", { quantity: quantityChange?.variant.quantity })}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label={t("quantity_change_amount")}
          margin="normal"
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          type="number"
          value={quantityChangeAmount}
          error={quantityChangeAmount !== "" && !isQuantityChangeValid}
          helperText={quantityChangeAmount === ""
            ? undefined
            : !isQuantityChangeAmountValid
              ? t("quantity_must_be_positive_integer")
              : !isFutureQuantityValid
                ? t("quantity_must_not_be_negative")
                : undefined}
          onChange={(event) => setQuantityChangeAmount(event.target.value)}
        />
        {futureQuantity !== undefined && (
          <Typography sx={{ mt: 1 }}>
            {t("future_quantity", { quantity: futureQuantity })}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={addProductQuantityResult.isLoading}
          color="error"
          variant="outlined"
          onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!isQuantityChangeValid}
          loading={addProductQuantityResult.isLoading}
          onClick={handleSubmit}>
          {quantityChange?.type === "increase" ? t("increase") : t("decrease")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuantityChangeDialog;
