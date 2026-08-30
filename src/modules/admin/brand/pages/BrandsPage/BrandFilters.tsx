import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { CountBrandsQuery } from "@/models/apis/brand/getBrands";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type BrandFiltersProps = {
  formContext: UseFormReturn<CountBrandsQuery>;
  onSubmit: (data: CountBrandsQuery) => void;
};

const model: DynamicFormModel<CountBrandsQuery> = {
  inputs: [
    { name: "name", inputType: "text", label: "admin-brand:brand_name", size: { sm: 8, md: 4 } },
    { name: "hasLogo", inputType: "checkbox", label: "admin-brand:has_logo", size: { sm: 4, md: 2 } },
    { name: "isTop", inputType: "checkbox", label: "admin-brand:top_brand", size: { sm: 4, md: 2 } },
    { name: "hasActiveProduct", inputType: "checkbox", label: "admin-brand:has_active_product", size: { sm: 4, md: 2 } },
  ],
  submitButtonText: "admin-brand:apply_filters",
};

function BrandFilters({ formContext, onSubmit }: BrandFiltersProps) {
  useTranslation("admin-brand");

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

export default BrandFilters;
