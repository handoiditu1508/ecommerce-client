import CascadingCategorySelect from "@/components/CascadingCategorySelect";
import CurrencyMaskInput from "@/components/CurrencyMaskInput";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import FileInput from "@/components/FileInput";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateProductCommand } from "@/models/apis/product/updateProduct";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/apis/productApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { InputBaseComponentProps } from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ProductReadonlyDetails from "./ProductReadonlyDetails";

function UpdateProductPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("product");
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
  const requiredRule = { required: t("this_field_is_required") };
  const formModel: DynamicFormModel<UpdateProductCommand> = {
    inputs: [
      { name: "id", inputType: "text", label: t("id"), required: true, readOnly: true },
      { name: "name", inputType: "text", label: t("product_name"), required: true, rules: requiredRule },
      { name: "price", inputType: "text", label: t("price"), required: true, rules: requiredRule },
      { name: "categoryId", inputType: "text", label: t("category") },
      { name: "thumbnailFile", inputType: "text", label: t("thumbnail") },
    ],
    submitButtonText: t("update_product"),
  };

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
          price: (
            <Controller
              control={formContext.control}
              name="price"
              rules={{
                required: t("this_field_is_required"),
                min: { value: 0, message: t("price_must_not_be_negative") },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label={t("price")}
                  value={field.value.toString()}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  disabled={updateResult.isLoading}
                  slotProps={{
                    input: {
                      inputComponent: CurrencyMaskInput as unknown as React.ElementType<
                        InputBaseComponentProps
                      >,
                    },
                  }}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(
                    event.target.value === "" ? 0 : Number(event.target.value),
                  )}
                />
              )}
            />
          ),
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
          thumbnailFile: (
            <Controller
              control={formContext.control}
              name="thumbnailFile"
              render={({ field, fieldState }) => (
                <FormControl fullWidth margin="normal" error={fieldState.invalid}>
                  <FormLabel>{t("thumbnail_optional")}</FormLabel>
                  <FileInput
                    files={field.value ? [field.value] : []}
                    error={fieldState.error?.message}
                    disabled={updateResult.isLoading}
                    inputProps={{
                      accept: "image/*",
                      name: field.name,
                      onBlur: field.onBlur,
                    }}
                    onFilesChange={(files) => field.onChange(files[0])}
                  />
                </FormControl>
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
