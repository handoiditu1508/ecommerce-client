import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CreatePromotionBannerCommand } from "@/models/apis/promotionBanner/createPromotionBanner";
import { PromotionBannerStatus } from "@/models/entities/PromotionBanner";
import { useCreatePromotionBannerMutation } from "@/redux/apis/promotionBannerApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const statusOptions: DynamicInputOption<CreatePromotionBannerCommand, "status">[] = [
  { key: PromotionBannerStatus.Active, label: "admin-promotion-banner:active", value: PromotionBannerStatus.Active },
  { key: PromotionBannerStatus.Disabled, label: "admin-promotion-banner:disabled", value: PromotionBannerStatus.Disabled },
];

const formModel: DynamicFormModel<CreatePromotionBannerCommand> = {
  inputs: [
    {
      name: "promotionId",
      inputType: "number",
      label: "admin-promotion-banner:promotion",
      min: 1,
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "imageFile",
      inputType: "file",
      label: "admin-promotion-banner:image",
      accept: "image/*",
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "isVisible",
      inputType: "checkbox",
      label: "admin-promotion-banner:visible_on_slider",
    },
    {
      name: "status",
      inputType: "select",
      label: "admin-promotion-banner:status",
      options: statusOptions,
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "sortOrder", inputType: "number", label: "admin-promotion-banner:sort_order", min: 0 },
  ],
  submitButtonText: "admin:create_promotion_banner",
};

function CreatePromotionBannerPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-promotion-banner", "translation", "admin"]);
  const [createPromotionBanner, result] = useCreatePromotionBannerMutation();
  const formContext = useForm<CreatePromotionBannerCommand>({
    defaultValues: {
      promotionId: 0,
      imageFile: undefined,
      isVisible: true,
      status: PromotionBannerStatus.Active,
      sortOrder: undefined,
    },
  });

  const handleSubmit = async (data: CreatePromotionBannerCommand) => {
    try {
      await createPromotionBanner(data).unwrap();
      dispatch(pushNotification({
        text: t("promotion_banner_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/promotion-banners");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_promotion_banner")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreatePromotionBannerPage;
