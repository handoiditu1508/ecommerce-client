import CascadingCategorySelect from "@/components/CascadingCategorySelect";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import FileInput from "@/components/FileInput";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { CreateProductCommand } from "@/models/apis/product/createProduct";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useCreateProductMutation } from "@/redux/apis/productApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateProductCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "product:product_name",
      required: true,
      rules: { required: "product:this_field_is_required" },
    },
    {
      name: "sku",
      inputType: "text",
      label: "product:sku",
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
      inputType: "text",
      label: "product:thumbnail",
      required: true,
      rules: { required: "product:this_field_is_required" },
    },
  ],
  submitButtonText: "product:create_product",
};

function CreateProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const [createProduct, result] = useCreateProductMutation();
  const formContext = useForm<CreateProductCommand>({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: undefined,
      sku: "",
      thumbnailFile: undefined,
    },
  });

  const handleSubmit = async (data: CreateProductCommand) => {
    try {
      await createProduct(data).unwrap();
      dispatch(pushNotification({
        text: t("product_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/products");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("create_product")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        renderInputMap={{
          categoryId: <Controller
            control={formContext.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <CascadingCategorySelect
                categories={categories}
                value={field.value}
                label={t("category_optional")}
                disabled={result.isLoading}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />,
          thumbnailFile: <Controller
            control={formContext.control}
            name="thumbnailFile"
            rules={{ required: t("this_field_is_required") }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth required margin="normal" error={fieldState.invalid}>
                <FormLabel>{t("thumbnail")}</FormLabel>
                <FileInput
                  files={field.value ? [field.value] : []}
                  error={fieldState.error?.message}
                  disabled={result.isLoading}
                  inputProps={{
                    accept: "image/*",
                    name: field.name,
                    onBlur: field.onBlur,
                  }}
                  onFilesChange={(files) => field.onChange(files[0])}
                />
              </FormControl>
            )}
          />,
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateProductPage;
