import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { CountProductDiscountsQuery } from "@/models/apis/productDiscount/getProductDiscounts";
import { PromotionStatus } from "@/models/entities/Promotion";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ProductDiscountFiltersProps = {
  formContext: UseFormReturn<CountProductDiscountsQuery>;
  onSubmit: (data: CountProductDiscountsQuery) => void;
};

const statusOptions: DynamicInputOption<CountProductDiscountsQuery, "statuses">[] = [
  { key: PromotionStatus.Active, label: "admin-product-discount:active", value: PromotionStatus.Active },
  { key: PromotionStatus.Disabled, label: "admin-product-discount:disabled", value: PromotionStatus.Disabled },
];

const model: DynamicFormModel<CountProductDiscountsQuery> = {
  inputs: [
    { name: "name", inputType: "text", label: "admin:name", size: { sm: 6, md: 3 } },
    {
      name: "statuses",
      inputType: "select",
      label: "admin-product-discount:statuses",
      multiple: true,
      showCheckbox: true,
      options: statusOptions,
      size: { sm: 6, md: 3 },
    },
    { name: "isPercentage", inputType: "checkbox", label: "admin-product-discount:is_percentage", size: { sm: 6, md: 3 } },
    { name: "requiredProductQuantity", inputType: "currency", currencySymbol: "", label: "admin-product-discount:required_product_quantity", size: { sm: 6, md: 3 } },
    { name: "minDiscountValue", inputType: "currency", label: "admin-product-discount:min_discount_value", size: { sm: 6, md: 3 } },
    { name: "maxDiscountValue", inputType: "currency", label: "admin-product-discount:max_discount_value", size: { sm: 6, md: 3 } },
  ],
  submitButtonText: "admin-product-discount:apply_filters",
};

function ProductDiscountFilters({ formContext, onSubmit }: ProductDiscountFiltersProps) {
  useTranslation(["admin-product-discount", "admin"]);

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

export default ProductDiscountFilters;
