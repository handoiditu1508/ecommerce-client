import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useProductSearchOptions from "@/hooks/useProductSearchOptions";
import { UpdateProductDiscountCommand } from "@/models/apis/productDiscount/updateProductDiscount";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useGetProductsToRehydrateCartQuery } from "@/redux/apis/productApi";
import { useGetProductDiscountQuery, useUpdateProductDiscountMutation } from "@/redux/apis/productDiscountApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type UpdateProductDiscountForm = Omit<UpdateProductDiscountCommand, "startDate" | "endDate"> & {
  startDate?: string;
  endDate?: string;
};

const formModel: DynamicFormModel<UpdateProductDiscountForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
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
  submitButtonText: "admin-product-discount:update_product_discount",
};

function UpdateProductDiscountPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-product-discount", "translation", "admin"]);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<UpdateProductDiscountForm, "categoryIds">[]>(
    () => categoriesToDynamicInputOptions<UpdateProductDiscountForm, "categoryIds">(categories),
    [categories]
  );
  const productDiscountResult = useGetProductDiscountQuery({ productDiscountId: id }, { skip: !Number.isInteger(id) });
  const [updateProductDiscount, updateResult] = useUpdateProductDiscountMutation();
  const knownProductIds = useMemo(() => [
    ...(productDiscountResult.data?.productIds ?? []),
    ...(productDiscountResult.data?.excludedProductIds ?? []),
  ], [productDiscountResult.data]);
  const knownProductsResult = useGetProductsToRehydrateCartQuery(
    { productIds: knownProductIds },
    { skip: knownProductIds.length === 0 },
  );
  const knownProducts = useMemo(
    () => (knownProductsResult.data ?? []).map((product) => ({ id: product.id, name: product.name })),
    [knownProductsResult.data],
  );
  const formContext = useForm<UpdateProductDiscountForm>({ values: productDiscountResult.data });
  const productIds = formContext.watch("productIds");
  const excludedProductIds = formContext.watch("excludedProductIds");
  const isPercentage = formContext.watch("isPercentage");
  const productOptions = useProductSearchOptions<UpdateProductDiscountForm, "productIds">(excludedProductIds, knownProducts);
  const excludedProductOptions = useProductSearchOptions<UpdateProductDiscountForm, "excludedProductIds">(productIds, knownProducts);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_product_discount_id")}</Alert>;
  if (productDiscountResult.isLoading) return <CircularProgress />;
  if (!productDiscountResult.data) return <Alert severity="error">{t("unable_to_load_product_discount")}</Alert>;

  const handleSubmit = async (data: UpdateProductDiscountForm) => {
    try {
      await updateProductDiscount({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }).unwrap();
      dispatch(pushNotification({
        text: t("product_discount_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_product_discount")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
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

export default UpdateProductDiscountPage;
