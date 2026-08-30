import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useProductSearchOptions from "@/hooks/useProductSearchOptions";
import { CreateProductDiscountCommand } from "@/models/apis/productDiscount/createProductDiscount";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useCreateProductDiscountMutation } from "@/redux/apis/productDiscountApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateProductDiscountCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "description", inputType: "text", label: "admin-product-discount:description" },
    { name: "startDate", inputType: "datetime", label: "admin-product-discount:start_date", size: { sm: 6 } },
    { name: "endDate", inputType: "datetime", label: "admin-product-discount:end_date", size: { sm: 6 } },
    {
      name: "requiredProductQuantity",
      inputType: "number",
      min: 0,
      label: "admin-product-discount:required_product_quantity",
      size: { sm: 6 },
    },
    {
      name: "discountValue",
      inputType: "currency",
      label: "admin-product-discount:discount_value",
      required: true,
      rules: { required: "translation:this_field_is_required" },
      size: { sm: 6 },
    },
    { name: "isPercentage", inputType: "checkbox", label: "admin-product-discount:is_percentage" },
    { name: "productIds", inputType: "autocomplete", label: "admin:products", multiple: true, searchAsYouType: true, options: [] },
    { name: "categoryIds", inputType: "cascadingselect", label: "admin:categories", multiple: true, options: [] },
    {
      name: "excludedProductIds",
      inputType: "autocomplete",
      label: "admin-product-discount:excluded_products",
      multiple: true,
      searchAsYouType: true,
      options: [],
    },
  ],
  submitButtonText: "admin:create_product_discount",
};

function CreateProductDiscountPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-product-discount", "translation", "admin"]);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<CreateProductDiscountCommand, "categoryIds">[]>(
    () => categoriesToDynamicInputOptions<CreateProductDiscountCommand, "categoryIds">(categories),
    [categories]
  );
  const [createProductDiscount, result] = useCreateProductDiscountMutation();
  const formContext = useForm<CreateProductDiscountCommand>({
    defaultValues: {
      name: "",
      discountValue: 0,
      isPercentage: false,
    },
  });
  const productIds = formContext.watch("productIds");
  const excludedProductIds = formContext.watch("excludedProductIds");
  const isPercentage = formContext.watch("isPercentage");
  const productOptions = useProductSearchOptions<CreateProductDiscountCommand, "productIds">(excludedProductIds);
  const excludedProductOptions = useProductSearchOptions<CreateProductDiscountCommand, "excludedProductIds">(productIds);

  const handleSubmit = async (data: CreateProductDiscountCommand) => {
    try {
      await createProductDiscount(data).unwrap();
      dispatch(pushNotification({
        text: t("product_discount_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/promotions/product-discounts");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_product_discount")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        optionsMap={{
          categoryIds: categoryOptions,
          productIds: productOptions.options,
          excludedProductIds: excludedProductOptions.options,
        }}
        autocompleteOnInputChangeMap={{
          productIds: productOptions.onInputChange,
          excludedProductIds: excludedProductOptions.onInputChange,
        }}
        autocompleteLoadingMap={{
          productIds: productOptions.loading,
          excludedProductIds: excludedProductOptions.loading,
        }}
        endAdornmentMap={{
          discountValue: isPercentage ? <PercentIcon fontSize="small" /> : undefined,
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateProductDiscountPage;
