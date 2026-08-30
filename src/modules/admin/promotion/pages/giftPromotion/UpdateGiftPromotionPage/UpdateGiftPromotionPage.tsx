import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useProductSearchOptions from "@/hooks/useProductSearchOptions";
import { UpdateGiftPromotionCommand } from "@/models/apis/giftPromotion/updateGiftPromotion";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useGetProductsToRehydrateCartQuery } from "@/redux/apis/productApi";
import { useGetGiftPromotionQuery, useUpdateGiftPromotionMutation } from "@/redux/apis/giftPromotionApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GiftPromotionGiftsForm from "./GiftPromotionGiftsForm";

type UpdateGiftPromotionForm = Omit<UpdateGiftPromotionCommand, "startDate" | "endDate"> & {
  startDate?: string;
  endDate?: string;
};

const formModel: DynamicFormModel<UpdateGiftPromotionForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
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
  submitButtonText: "admin-gift-promotion:update_gift_promotion",
};

function UpdateGiftPromotionPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-gift-promotion", "translation", "admin"]);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<UpdateGiftPromotionForm, "categoryIds">[]>(
    () => categoriesToDynamicInputOptions<UpdateGiftPromotionForm, "categoryIds">(categories),
    [categories]
  );
  const giftPromotionResult = useGetGiftPromotionQuery({ giftPromotionId: id }, { skip: !Number.isInteger(id) });
  const [updateGiftPromotion, updateResult] = useUpdateGiftPromotionMutation();
  const knownProductIds = useMemo(() => [
    ...(giftPromotionResult.data?.productIds ?? []),
    ...(giftPromotionResult.data?.excludedProductIds ?? []),
  ], [giftPromotionResult.data]);
  const knownProductsResult = useGetProductsToRehydrateCartQuery(
    { productIds: knownProductIds },
    { skip: knownProductIds.length === 0 },
  );
  const knownProducts = useMemo(
    () => (knownProductsResult.data ?? []).map((product) => ({ id: product.id, name: product.name })),
    [knownProductsResult.data],
  );
  const formContext = useForm<UpdateGiftPromotionForm>({ values: giftPromotionResult.data });
  const productIds = formContext.watch("productIds");
  const excludedProductIds = formContext.watch("excludedProductIds");
  const productOptions = useProductSearchOptions<UpdateGiftPromotionForm, "productIds">(excludedProductIds, knownProducts);
  const excludedProductOptions = useProductSearchOptions<UpdateGiftPromotionForm, "excludedProductIds">(productIds, knownProducts);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_gift_promotion_id")}</Alert>;
  if (giftPromotionResult.isLoading) return <CircularProgress />;
  if (!giftPromotionResult.data) return <Alert severity="error">{t("unable_to_load_gift_promotion")}</Alert>;

  const handleSubmit = async (data: UpdateGiftPromotionForm) => {
    try {
      await updateGiftPromotion({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }).unwrap();
      dispatch(pushNotification({
        text: t("gift_promotion_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_gift_promotion")}</Typography>
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
        onSubmit={handleSubmit}
      />
      <GiftPromotionGiftsForm giftPromotion={giftPromotionResult.data} />
    </Paper>
  );
}

export default UpdateGiftPromotionPage;
