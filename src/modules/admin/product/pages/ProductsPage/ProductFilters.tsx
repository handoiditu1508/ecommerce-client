import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import { CountProductsQuery } from "@/models/apis/product/getProducts";
import Category, { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ProductFiltersProps = {
  categories: Category[];
  formContext: UseFormReturn<CountProductsQuery>;
  onSubmit: (data: CountProductsQuery) => void;
};

const model: DynamicFormModel<CountProductsQuery> = {
  inputs: [
    { name: "id", inputType: "text", label: "admin:id", size: { sm: 4, md: 2 } },
    { name: "name", inputType: "text", label: "admin-product:product_name", size: { sm: 8, md: 4 } },
    { name: "minPrice", inputType: "currency", label: "product:min_price", size: { sm: 6, md: 3 } },
    { name: "maxPrice", inputType: "currency", label: "product:max_price", size: { sm: 6, md: 3 } },
    { name: "createdDate", inputType: "date", label: "admin-product:created_date", size: { sm: 6, md: 3 } },
    { name: "modifiedDate", inputType: "date", label: "admin-product:modified_date", size: { sm: 6, md: 3 } },
    { name: "categoryIds", inputType: "cascadingselect", label: "product:categories", options: [], multiple: true, size: { md: 6 } },
    { name: "includeSubCategories", inputType: "checkbox", label: "admin-product:include_subcategories" },
    { name: "isDeleted", inputType: "checkbox", label: "admin-product:load_deleted_products" },
  ],
  submitButtonText: "admin-product:apply_filters",
};

function ProductFilters({ categories, formContext, onSubmit }: ProductFiltersProps) {
  useTranslation(["admin-product", "product", "admin"]);
  const categoryOptions = useMemo<DynamicInputOption<CountProductsQuery, "categoryIds">[]>(
    () => categoriesToDynamicInputOptions<CountProductsQuery, "categoryIds">(categories),
    [categories]
  );

  return (
    <DynamicGridForm
      formContext={formContext}
      model={model}
      gridProps={{ spacing: 2 }}
      sx={{ mb: 3 }}
      optionsMap={{
        categoryIds: categoryOptions,
      }}
      onSubmit={onSubmit}
    />
  );
}

export default ProductFilters;
