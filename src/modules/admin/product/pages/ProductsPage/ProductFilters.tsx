import CascadingCategorySelect from "@/components/CascadingCategorySelect";
import CurrencyMaskInput from "@/components/CurrencyMaskInput";
import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { CountProductsQuery } from "@/models/apis/product/getProducts";
import Category from "@/models/entities/Category";
import { InputBaseComponentProps } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ProductFiltersProps = {
  categories: Category[];
  formContext: UseFormReturn<CountProductsQuery>;
  onSubmit: (data: CountProductsQuery) => void;
};

const model: DynamicFormModel<CountProductsQuery> = {
  inputs: [
    { name: "id", inputType: "text", label: "product:id", size: { sm: 4, md: 2 } },
    { name: "name", inputType: "text", label: "product:product_name", size: { sm: 8, md: 4 } },
    { name: "minPrice", inputType: "text", label: "product:min_price", size: { sm: 6, md: 3 } },
    { name: "maxPrice", inputType: "text", label: "product:max_price", size: { sm: 6, md: 3 } },
    { name: "createdDate", inputType: "date", label: "product:created_date", size: { sm: 6, md: 3 } },
    { name: "modifiedDate", inputType: "date", label: "product:modified_date", size: { sm: 6, md: 3 } },
    { name: "categoryIds", inputType: "text", label: "product:categories", size: { md: 6 } },
    { name: "includeSubCategories", inputType: "checkbox", label: "product:include_subcategories" },
    { name: "isDeleted", inputType: "checkbox", label: "product:load_deleted_products" },
  ],
  submitButtonText: "product:apply_filters",
};

function ProductFilters({ categories, formContext, onSubmit }: ProductFiltersProps) {
  const { t } = useTranslation("product");

  const renderPriceField = (name: "minPrice" | "maxPrice", label: string) => (
    <Controller
      control={formContext.control}
      name={name}
      render={({ field }) => (
        <TextField
          fullWidth
          margin="normal"
          label={label}
          value={field.value?.toString() ?? ""}
          slotProps={{
            input: {
              inputComponent: CurrencyMaskInput as unknown as React.ElementType<
                InputBaseComponentProps
              >,
            },
          }}
          onBlur={field.onBlur}
          onChange={(event) => field.onChange(
            event.target.value === "" ? undefined : Number(event.target.value),
          )}
        />
      )}
    />
  );

  return (
    <DynamicGridForm
      formContext={formContext}
      model={model}
      gridProps={{ spacing: 2 }}
      sx={{ mb: 3 }}
      renderInputMap={{
        minPrice: renderPriceField("minPrice", t("min_price")),
        maxPrice: renderPriceField("maxPrice", t("max_price")),
        categoryIds: (
          <Controller
            control={formContext.control}
            name="categoryIds"
            render={({ field }) => (
              <CascadingCategorySelect
                multiple
                categories={categories}
                values={field.value ?? []}
                label={t("categories")}
                onBlur={field.onBlur}
                onChange={() => undefined}
                onValuesChange={field.onChange}
              />
            )}
          />
        ),
      }}
      onSubmit={onSubmit}
    />
  );
}

export default ProductFilters;
