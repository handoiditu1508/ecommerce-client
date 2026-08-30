import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateGiftCommand } from "@/models/apis/gift/updateGift";
import { useGetGiftQuery, useUpdateGiftMutation } from "@/redux/apis/giftApi";
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

type UpdateGiftForm = Omit<UpdateGiftCommand, "thumbnailFile"> & {
  thumbnailFile: string;
  thumbnailFileList?: FileList;
};

const formModel: DynamicFormModel<UpdateGiftForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "quantity",
      inputType: "number",
      min: 0,
      label: "admin-gift:quantity",
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "thumbnailFile", inputType: "select", label: "admin-gift:thumbnail", options: [] },
  ],
  submitButtonText: "admin-gift:update_gift",
};

function UpdateGiftPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-gift", "translation"]);
  const giftResult = useGetGiftQuery({ giftId: id }, { skip: !Number.isInteger(id) });
  const [updateGift, updateResult] = useUpdateGiftMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousThumbnailSelectionRef = useRef<string | undefined>(undefined);
  const formValues = useMemo<UpdateGiftForm | undefined>(() => (
    giftResult.data
      ? {
        id: giftResult.data.id,
        name: giftResult.data.name,
        quantity: giftResult.data.quantity,
        thumbnailFile: KEEP_CURRENT_ID,
        thumbnailFileList: undefined,
      }
      : undefined
  ), [giftResult.data]);
  const formContext = useForm<UpdateGiftForm>({ values: formValues });
  const gift = giftResult.data;
  const thumbnailSelection = formContext.watch("thumbnailFile");

  const setFileInputRef = useCallback((fileInput: HTMLInputElement | null) => {
    fileInputRef.current = fileInput;

    const handleFileSelectionCancel = () => {
      formContext.setValue("thumbnailFile", previousThumbnailSelectionRef.current ?? KEEP_CURRENT_ID);
    };
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputRef.current === fileInput) fileInputRef.current = null;
    };
  }, [formContext]);

  // Open the file picker when the upload option is selected.
  useEffect(() => {
    if (thumbnailSelection === UPLOAD_NEW_ID && previousThumbnailSelectionRef.current !== undefined) {
      fileInputRef.current?.click();
    }
    previousThumbnailSelectionRef.current = thumbnailSelection;
  }, [thumbnailSelection]);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_gift_id")}</Alert>;
  if (giftResult.isLoading) return <CircularProgress />;
  if (!gift) return <Alert severity="error">{t("unable_to_load_gift")}</Alert>;

  const handleSubmit = async (data: UpdateGiftForm) => {
    const command: UpdateGiftCommand = {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      thumbnailFile: data.thumbnailFile === UPLOAD_NEW_ID ? data.thumbnailFileList : undefined,
    };
    try {
      await updateGift(command).unwrap();
      dispatch(pushNotification({
        text: t("gift_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_gift")}</Typography>
      <input
        ref={setFileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = event.currentTarget.files;
          const file = files?.item(0);

          if (!files?.length || !file) {
            formContext.setValue("thumbnailFile", previousThumbnailSelectionRef.current ?? KEEP_CURRENT_ID);

            return;
          }

          const fileContainer = new DataTransfer();
          fileContainer.items.add(file);
          formContext.setValue("thumbnailFileList", fileContainer.files, { shouldDirty: true });
          formContext.setValue("thumbnailFile", UPLOAD_NEW_ID, { shouldDirty: true });
          event.currentTarget.value = "";
        }}
      />
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={{
          thumbnailFile: [
            {
              key: UPLOAD_NEW_ID,
              label: "admin-gift:upload_new_thumbnail",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            {
              key: KEEP_CURRENT_ID,
              label: "admin-gift:current_thumbnail",
              value: KEEP_CURRENT_ID,
              avatar: <Avatar src={CONFIG.FILE_URL + gift.thumbnailPath} variant="rounded" />,
            },
          ],
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default UpdateGiftPage;
