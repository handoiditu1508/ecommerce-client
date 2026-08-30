import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { CountGiftPromotionsQuery } from "@/models/apis/giftPromotion/getGiftPromotions";
import { PromotionStatus } from "@/models/entities/Promotion";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type GiftPromotionFiltersProps = {
  formContext: UseFormReturn<CountGiftPromotionsQuery>;
  onSubmit: (data: CountGiftPromotionsQuery) => void;
};

const statusOptions: DynamicInputOption<CountGiftPromotionsQuery, "statuses">[] = [
  { key: PromotionStatus.Active, label: "admin-gift-promotion:active", value: PromotionStatus.Active },
  { key: PromotionStatus.Disabled, label: "admin-gift-promotion:disabled", value: PromotionStatus.Disabled },
];

const model: DynamicFormModel<CountGiftPromotionsQuery> = {
  inputs: [
    { name: "name", inputType: "text", label: "admin:name", size: { sm: 6, md: 4 } },
    {
      name: "statuses",
      inputType: "select",
      label: "admin-gift-promotion:statuses",
      multiple: true,
      showCheckbox: true,
      options: statusOptions,
      size: { sm: 6, md: 4 },
    },
    {
      name: "requiredProductQuantity",
      inputType: "currency",
      currencySymbol: "",
      label: "admin-gift-promotion:required_product_quantity",
      size: { sm: 6, md: 4 },
    },
  ],
  submitButtonText: "admin-gift-promotion:apply_filters",
};

function GiftPromotionFilters({ formContext, onSubmit }: GiftPromotionFiltersProps) {
  useTranslation(["admin-gift-promotion", "admin"]);

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

export default GiftPromotionFilters;
