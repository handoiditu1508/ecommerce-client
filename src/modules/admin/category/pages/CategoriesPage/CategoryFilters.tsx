import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { CountCategoriesQuery } from "@/models/apis/category/getCategories";
import { CategoryView } from "@/models/entities/Category";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CategoryFiltersProps = {
  categories: CategoryView[];
  formContext: UseFormReturn<CountCategoriesQuery>;
  onSubmit: (data: CountCategoriesQuery) => void;
};

const model: DynamicFormModel<CountCategoriesQuery> = {
  inputs: [
    { name: "id", inputType: "text", label: "admin-category:id", size: { sm: 4, md: 2 } },
    { name: "name", inputType: "text", label: "admin-category:category_name", size: { sm: 8, md: 4 } },
    { name: "parentId", inputType: "select", label: "admin-category:parent_category", options: [], size: { sm: 6, md: 4 } },
    { name: "hasIcon", inputType: "checkbox", label: "admin-category:has_icon", size: { sm: 6, md: 2 } },
  ],
  submitButtonText: "admin-category:apply_filters",
};

function CategoryFilters({ categories, formContext, onSubmit }: CategoryFiltersProps) {
  useTranslation("admin-category");
  const categoryOptions = useMemo<DynamicInputOption<CountCategoriesQuery, "parentId">[]>(
    () => categories.map((category) => ({ key: category.id, label: category.name, value: category.id })),
    [categories]
  );

  return (
    <DynamicGridForm
      formContext={formContext}
      model={model}
      gridProps={{ spacing: 2 }}
      sx={{ mb: 3 }}
      optionsMap={{
        parentId: categoryOptions,
      }}
      onSubmit={onSubmit}
    />
  );
}

export default CategoryFilters;
