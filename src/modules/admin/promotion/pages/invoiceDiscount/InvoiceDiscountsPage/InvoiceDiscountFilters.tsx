import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { CountInvoiceDiscountsQuery } from "@/models/apis/invoiceDiscount/getInvoiceDiscounts";
import { PromotionStatus } from "@/models/entities/Promotion";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type InvoiceDiscountFiltersProps = {
  formContext: UseFormReturn<CountInvoiceDiscountsQuery>;
  onSubmit: (data: CountInvoiceDiscountsQuery) => void;
};

const statusOptions: DynamicInputOption<CountInvoiceDiscountsQuery, "statuses">[] = [
  { key: PromotionStatus.Active, label: "admin-invoice-discount:active", value: PromotionStatus.Active },
  { key: PromotionStatus.Disabled, label: "admin-invoice-discount:disabled", value: PromotionStatus.Disabled },
];

const model: DynamicFormModel<CountInvoiceDiscountsQuery> = {
  inputs: [
    { name: "name", inputType: "text", label: "admin:name", size: { sm: 6, md: 3 } },
    { name: "discountCode", inputType: "text", label: "admin-invoice-discount:discount_code", size: { sm: 6, md: 3 } },
    {
      name: "statuses",
      inputType: "select",
      label: "admin-invoice-discount:statuses",
      multiple: true,
      showCheckbox: true,
      options: statusOptions,
      size: { sm: 6, md: 3 },
    },
    { name: "isPercentage", inputType: "checkbox", label: "admin-invoice-discount:is_percentage", size: { sm: 6, md: 3 } },
    { name: "minDiscountValue", inputType: "currency", label: "admin-invoice-discount:min_discount_value", size: { sm: 6, md: 3 } },
    { name: "maxDiscountValue", inputType: "currency", label: "admin-invoice-discount:max_discount_value", size: { sm: 6, md: 3 } },
  ],
  submitButtonText: "admin-invoice-discount:apply_filters",
};

function InvoiceDiscountFilters({ formContext, onSubmit }: InvoiceDiscountFiltersProps) {
  useTranslation(["admin-invoice-discount", "admin"]);

  return (
    <DynamicGridForm
      formContext={formContext}
      model={model}
      gridProps={{ spacing: 2 }}
      sx={{ mb: 3 }}
      onSubmit={onSubmit}
    />
  );
}

export default InvoiceDiscountFilters;
