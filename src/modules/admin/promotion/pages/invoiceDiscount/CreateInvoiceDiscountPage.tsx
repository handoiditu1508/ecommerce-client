import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CreateInvoiceDiscountCommand } from "@/models/apis/invoiceDiscount/createInvoiceDiscount";
import { useCreateInvoiceDiscountMutation } from "@/redux/apis/invoiceDiscountApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateInvoiceDiscountCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
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
  submitButtonText: "admin:create_invoice_discount",
};

function CreateInvoiceDiscountPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-invoice-discount", "translation", "admin"]);
  const [createInvoiceDiscount, result] = useCreateInvoiceDiscountMutation();
  const formContext = useForm<CreateInvoiceDiscountCommand>({
    defaultValues: {
      name: "",
      discountCode: "",
      discountValue: 0,
      isPercentage: false,
    },
  });
  const isPercentage = formContext.watch("isPercentage");

  const handleSubmit = async (data: CreateInvoiceDiscountCommand) => {
    try {
      await createInvoiceDiscount(data).unwrap();
      dispatch(pushNotification({
        text: t("invoice_discount_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/promotions/invoice-discounts");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_invoice_discount")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        endAdornmentMap={{
          discountValue: isPercentage ? <PercentIcon fontSize="small" /> : undefined,
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateInvoiceDiscountPage;
