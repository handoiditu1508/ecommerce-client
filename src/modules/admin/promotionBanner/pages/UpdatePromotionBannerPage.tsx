import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdatePromotionBannerCommand } from "@/models/apis/promotionBanner/updatePromotionBanner";
import { PromotionBannerStatus } from "@/models/entities/PromotionBanner";
import { useGetPromotionBannerQuery, useUpdatePromotionBannerMutation } from "@/redux/apis/promotionBannerApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import UploadIcon from "@mui/icons-material/Upload";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const UPLOAD_NEW_ID = "upload-new";
const KEEP_CURRENT_ID = "keep-current";

const statusOptions: DynamicInputOption<UpdatePromotionBannerForm, "status">[] = [
  { key: PromotionBannerStatus.Active, label: "admin-promotion-banner:active", value: PromotionBannerStatus.Active },
  { key: PromotionBannerStatus.Disabled, label: "admin-promotion-banner:disabled", value: PromotionBannerStatus.Disabled },
];

type UpdatePromotionBannerForm = Omit<UpdatePromotionBannerCommand, "imageFile"> & {
  imageFile: string;
  imageFileList?: FileList;
};

const formModel: DynamicFormModel<UpdatePromotionBannerForm> = {
  inputs: [
    {
      name: "promotionId",
      inputType: "number",
      label: "admin-promotion-banner:promotion",
      min: 1,
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "imageFile", inputType: "select", label: "admin-promotion-banner:image", options: [] },
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
  submitButtonText: "admin-promotion-banner:update_promotion_banner",
};

function UpdatePromotionBannerPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-promotion-banner", "translation", "admin"]);
  const promotionBannerResult = useGetPromotionBannerQuery({ promotionBannerId: id }, { skip: !Number.isInteger(id) });
  const [updatePromotionBanner, updateResult] = useUpdatePromotionBannerMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImageSelectionRef = useRef<string | undefined>(undefined);
  const formValues = useMemo<UpdatePromotionBannerForm | undefined>(() => (
    promotionBannerResult.data
      ? {
        id: promotionBannerResult.data.id,
        promotionId: promotionBannerResult.data.promotionId,
        isVisible: promotionBannerResult.data.isVisible,
        status: promotionBannerResult.data.status,
        sortOrder: promotionBannerResult.data.sortOrder,
        imageFile: KEEP_CURRENT_ID,
        imageFileList: undefined,
      }
      : undefined
  ), [promotionBannerResult.data]);
  const formContext = useForm<UpdatePromotionBannerForm>({ values: formValues });
  const promotionBanner = promotionBannerResult.data;
  const imageSelection = formContext.watch("imageFile");

  const setFileInputRef = useCallback((fileInput: HTMLInputElement | null) => {
    fileInputRef.current = fileInput;

    const handleFileSelectionCancel = () => {
      formContext.setValue("imageFile", previousImageSelectionRef.current ?? KEEP_CURRENT_ID);
    };
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputRef.current === fileInput) fileInputRef.current = null;
    };
  }, [formContext]);

  // Open the file picker when the upload option is selected.
  useEffect(() => {
    if (imageSelection === UPLOAD_NEW_ID && previousImageSelectionRef.current !== undefined) {
      fileInputRef.current?.click();
    }
    if (imageSelection !== UPLOAD_NEW_ID) {
      previousImageSelectionRef.current = imageSelection;
    }
  }, [imageSelection]);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_promotion_banner_id")}</Alert>;
  if (promotionBannerResult.isLoading) return <CircularProgress />;
  if (!promotionBanner) return <Alert severity="error">{t("unable_to_load_promotion_banner")}</Alert>;

  const handleSubmit = async (data: UpdatePromotionBannerForm) => {
    const command: UpdatePromotionBannerCommand = {
      id: data.id,
      promotionId: data.promotionId,
      isVisible: data.isVisible,
      status: data.status,
      sortOrder: data.sortOrder,
      imageFile: data.imageFile === UPLOAD_NEW_ID ? data.imageFileList : undefined,
    };
    try {
      await updatePromotionBanner(command).unwrap();
      dispatch(pushNotification({
        text: t("promotion_banner_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_promotion_banner")}</Typography>
      <input
        ref={setFileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = event.currentTarget.files;
          const file = files?.item(0);

          if (!files?.length || !file) {
            formContext.setValue("imageFile", previousImageSelectionRef.current ?? KEEP_CURRENT_ID);

            return;
          }

          const fileContainer = new DataTransfer();
          fileContainer.items.add(file);
          formContext.setValue("imageFileList", fileContainer.files, { shouldDirty: true });
          formContext.setValue("imageFile", UPLOAD_NEW_ID, { shouldDirty: true });
          event.currentTarget.value = "";
        }}
      />
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={{
          imageFile: [
            {
              key: UPLOAD_NEW_ID,
              label: "admin-promotion-banner:upload_new_image",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            {
              key: KEEP_CURRENT_ID,
              label: "admin-promotion-banner:current_image",
              value: KEEP_CURRENT_ID,
              avatar: <Avatar src={CONFIG.FILE_URL + promotionBanner.imagePath} variant="rounded" />,
            },
          ],
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default UpdatePromotionBannerPage;
