import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useProductSearchOptions from "@/hooks/useProductSearchOptions";
import { CreateGiftPromotionCommand } from "@/models/apis/giftPromotion/createGiftPromotion";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useCreateGiftPromotionMutation } from "@/redux/apis/giftPromotionApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateGiftPromotionCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "description", inputType: "text", label: "admin-gift-promotion:description" },
    { name: "startDate", inputType: "datetime", label: "admin-gift-promotion:start_date", size: { sm: 6 } },
    { name: "endDate", inputType: "datetime", label: "admin-gift-promotion:end_date", size: { sm: 6 } },
    {
      name: "requiredProductQuantity",
      inputType: "number",
      min: 0,
      label: "admin-gift-promotion:required_product_quantity",
    },
    { name: "productIds", inputType: "autocomplete", label: "admin:products", multiple: true, searchAsYouType: true, options: [] },
    { name: "categoryIds", inputType: "cascadingselect", label: "admin:categories", multiple: true, options: [] },
    {
      name: "excludedProductIds",
      inputType: "autocomplete",
      label: "admin-gift-promotion:excluded_products",
      multiple: true,
      searchAsYouType: true,
      options: [],
    },
  ],
  submitButtonText: "admin:create_gift_promotion",
};

function CreateGiftPromotionPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-gift-promotion", "translation", "admin"]);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<CreateGiftPromotionCommand, "categoryIds">[]>(
    () => categoriesToDynamicInputOptions<CreateGiftPromotionCommand, "categoryIds">(categories),
    [categories]
  );
  const [createGiftPromotion, result] = useCreateGiftPromotionMutation();
  const formContext = useForm<CreateGiftPromotionCommand>({
    defaultValues: {
      name: "",
    },
  });
  const productIds = formContext.watch("productIds");
  const excludedProductIds = formContext.watch("excludedProductIds");
  const productOptions = useProductSearchOptions<CreateGiftPromotionCommand, "productIds">(excludedProductIds);
  const excludedProductOptions = useProductSearchOptions<CreateGiftPromotionCommand, "excludedProductIds">(productIds);

  const handleSubmit = async (data: CreateGiftPromotionCommand) => {
    try {
      await createGiftPromotion(data).unwrap();
      dispatch(pushNotification({
        text: t("gift_promotion_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/promotions/gift-promotions");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_gift_promotion")}</Typography>
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
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateGiftPromotionPage;
