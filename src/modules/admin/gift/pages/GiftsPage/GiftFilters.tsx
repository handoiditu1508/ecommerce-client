import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { CountGiftsQuery } from "@/models/apis/gift/getGifts";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type GiftFiltersProps = {
  formContext: UseFormReturn<CountGiftsQuery>;
  onSubmit: (data: CountGiftsQuery) => void;
};

const model: DynamicFormModel<CountGiftsQuery> = {
  inputs: [
    { name: "name", inputType: "text", label: "admin:name", size: { sm: 8, md: 4 } },
    { name: "isDeleted", inputType: "checkbox", label: "admin-gift:load_deleted_gifts", size: { sm: 4, md: 2 } },
  ],
  submitButtonText: "admin-gift:apply_filters",
};

function GiftFilters({ formContext, onSubmit }: GiftFiltersProps) {
  useTranslation(["admin-gift", "admin"]);

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

export default GiftFilters;
