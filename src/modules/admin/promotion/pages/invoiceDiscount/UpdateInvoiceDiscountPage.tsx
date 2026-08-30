import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateInvoiceDiscountCommand } from "@/models/apis/invoiceDiscount/updateInvoiceDiscount";
import { useGetInvoiceDiscountQuery, useUpdateInvoiceDiscountMutation } from "@/redux/apis/invoiceDiscountApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type UpdateInvoiceDiscountForm = Omit<UpdateInvoiceDiscountCommand, "startDate" | "endDate"> & {
  startDate?: string;
  endDate?: string;
};

const formModel: DynamicFormModel<UpdateInvoiceDiscountForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "description", inputType: "text", label: "admin-invoice-discount:description" },
    { name: "startDate", inputType: "datetime", label: "admin-invoice-discount:start_date", size: { sm: 6 } },
    { name: "endDate", inputType: "datetime", label: "admin-invoice-discount:end_date", size: { sm: 6 } },
    {
      name: "discountCode",
      inputType: "text",
      label: "admin-invoice-discount:discount_code",
      required: true,
      maxLength: 32,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "discountValue",
      inputType: "currency",
      label: "admin-invoice-discount:discount_value",
      required: true,
      rules: { required: "translation:this_field_is_required" },
      size: { sm: 6 },
    },
    { name: "isPercentage", inputType: "checkbox", label: "admin-invoice-discount:is_percentage", size: { sm: 6 } },
    { name: "discountLimit", inputType: "currency", label: "admin-invoice-discount:discount_limit", size: { sm: 6 } },
    { name: "requiredInvoiceValue", inputType: "currency", label: "admin-invoice-discount:required_invoice_value", size: { sm: 6 } },
    { name: "usesLimit", inputType: "number", min: 0, label: "admin-invoice-discount:uses_limit", size: { sm: 6 } },
    { name: "usesLimitsPerUser", inputType: "number", min: 0, label: "admin-invoice-discount:uses_limits_per_user", size: { sm: 6 } },
  ],
  submitButtonText: "admin-invoice-discount:update_invoice_discount",
};

function UpdateInvoiceDiscountPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-invoice-discount", "translation", "admin"]);
  const invoiceDiscountResult = useGetInvoiceDiscountQuery({ invoiceDiscountId: id }, { skip: !Number.isInteger(id) });
  const [updateInvoiceDiscount, updateResult] = useUpdateInvoiceDiscountMutation();
  const formContext = useForm<UpdateInvoiceDiscountForm>({ values: invoiceDiscountResult.data });
  const isPercentage = formContext.watch("isPercentage");

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_invoice_discount_id")}</Alert>;
  if (invoiceDiscountResult.isLoading) return <CircularProgress />;
  if (!invoiceDiscountResult.data) return <Alert severity="error">{t("unable_to_load_invoice_discount")}</Alert>;

  const handleSubmit = async (data: UpdateInvoiceDiscountForm) => {
    try {
      await updateInvoiceDiscount({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }).unwrap();
      dispatch(pushNotification({
        text: t("invoice_discount_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_invoice_discount")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        endAdornmentMap={{
          discountValue: isPercentage ? <PercentIcon fontSize="small" /> : undefined,
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default UpdateInvoiceDiscountPage;
