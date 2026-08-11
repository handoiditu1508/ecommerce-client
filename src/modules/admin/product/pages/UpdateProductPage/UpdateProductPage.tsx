import CascadingCategorySelect from "@/components/CascadingCategorySelect";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateProductCommand } from "@/models/apis/product/updateProduct";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/apis/productApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ProductReadonlyDetails from "./ProductReadonlyDetails";

const formModel: DynamicFormModel<UpdateProductCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "product:product_name",
      required: true,
      rules: { required: "product:this_field_is_required" },
    },
    {
      name: "price",
      inputType: "currency",
      label: "product:price",
      required: true,
      rules: {
        required: "product:this_field_is_required",
        min: { value: 0, message: "product:price_must_not_be_negative" },
      },
    },
    { name: "categoryId", inputType: "text", label: "product:category" },
    {
      name: "thumbnailFile",
      inputType: "file",
      label: "product:thumbnail_optional",
      accept: "image/*",
    },
  ],
  submitButtonText: "product:update_product",
};

function UpdateProductPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const productResult = useGetProductQuery(
    { productId: id },
    { skip: !Number.isInteger(id) },
  );
  const [updateProduct, updateResult] = useUpdateProductMutation();
  const formValues = useMemo<UpdateProductCommand | undefined>(() => (
    productResult.data
      ? {
        id: productResult.data.id,
        name: productResult.data.name,
        price: productResult.data.price,
        categoryId: productResult.data.categoryId,
        thumbnailFile: undefined,
      }
      : undefined
  ), [productResult.data]);
  const formContext = useForm<UpdateProductCommand>({ values: formValues });

  if (!Number.isInteger(id)) {
    return <Alert severity="error">{t("invalid_product_id")}</Alert>;
  }
  if (productResult.isLoading) return <CircularProgress />;
  if (!productResult.data) {
    return <Alert severity="error">{t("unable_to_load_product")}</Alert>;
  }

  const handleSubmit = async (data: UpdateProductCommand) => {
    try {
      await updateProduct(data).unwrap();
      dispatch(pushNotification({
        text: t("product_updated_successfully"),
        severity: "success",
      }));
      navigate("/admin/products");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_product")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        renderInputMap={{
          categoryId: (
            <Controller
              control={formContext.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <CascadingCategorySelect
                  categories={categories}
                  value={field.value}
                  label={t("category_optional")}
                  disabled={updateResult.isLoading}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
          ),
        }}
        onSubmit={handleSubmit}
      />
      <ProductReadonlyDetails product={productResult.data} />
    </Paper>
  );
}

export default UpdateProductPage;
