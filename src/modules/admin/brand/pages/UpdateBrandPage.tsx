import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateBrandCommand } from "@/models/apis/brand/updateBrand";
import { useGetBrandQuery, useUpdateBrandMutation } from "@/redux/apis/brandApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import ClearIcon from "@mui/icons-material/Clear";
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
const REMOVE_LOGO_ID = "remove-logo";
const KEEP_CURRENT_ID = "keep-current";

type UpdateBrandForm = Omit<UpdateBrandCommand, "logoFile"> & {
  logoFile: string;
  logoFileList?: FileList;
};

const formModel: DynamicFormModel<UpdateBrandForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin-brand:brand_name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "logoFile", inputType: "select", label: "admin-brand:logo", options: [] },
    { name: "isTop", inputType: "checkbox", label: "admin-brand:top_brand" },
  ],
  submitButtonText: "admin-brand:update_brand",
};

function UpdateBrandPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-brand", "translation", "admin"]);
  const brandResult = useGetBrandQuery({ brandId: id }, { skip: !Number.isInteger(id) });
  const [updateBrand, updateResult] = useUpdateBrandMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousLogoSelectionRef = useRef<string | undefined>(undefined);
  const formValues = useMemo<UpdateBrandForm | undefined>(() => (
    brandResult.data
      ? {
        id: brandResult.data.id,
        name: brandResult.data.name,
        logoFile: brandResult.data.logoPath ? KEEP_CURRENT_ID : REMOVE_LOGO_ID,
        logoFileList: undefined,
        isRemoveLogo: false,
        isTop: brandResult.data.isTop,
      }
      : undefined
  ), [brandResult.data]);
  const formContext = useForm<UpdateBrandForm>({ values: formValues });
  const brand = brandResult.data;
  const logoSelection = formContext.watch("logoFile");
  const defaultLogoSelection = brand?.logoPath ? KEEP_CURRENT_ID : REMOVE_LOGO_ID;

  const setFileInputRef = useCallback((fileInput: HTMLInputElement | null) => {
    fileInputRef.current = fileInput;

    const handleFileSelectionCancel = () => {
      formContext.setValue("logoFile", previousLogoSelectionRef.current ?? defaultLogoSelection);
    };
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputRef.current === fileInput) fileInputRef.current = null;
    };
  }, [defaultLogoSelection, formContext]);

  // Open the file picker when the upload option is selected.
  useEffect(() => {
    if (logoSelection === UPLOAD_NEW_ID && previousLogoSelectionRef.current !== undefined) {
      fileInputRef.current?.click();
    }
    previousLogoSelectionRef.current = logoSelection;
  }, [logoSelection]);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_brand_id")}</Alert>;
  if (brandResult.isLoading) return <CircularProgress />;
  if (!brand) return <Alert severity="error">{t("unable_to_load_brand")}</Alert>;

  const handleSubmit = async (data: UpdateBrandForm) => {
    const command: UpdateBrandCommand = {
      id: data.id,
      name: data.name,
      logoFile: data.logoFile === UPLOAD_NEW_ID ? data.logoFileList : undefined,
      isRemoveLogo: data.logoFile === REMOVE_LOGO_ID,
      isTop: data.isTop,
    };
    try {
      await updateBrand(command).unwrap();
      dispatch(pushNotification({
        text: t("brand_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_brand")}</Typography>
      <input
        ref={setFileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = event.currentTarget.files;
          const file = files?.item(0);

          if (!files?.length || !file) {
            formContext.setValue("logoFile", previousLogoSelectionRef.current ?? defaultLogoSelection);

            return;
          }

          const fileContainer = new DataTransfer();
          fileContainer.items.add(file);
          formContext.setValue("logoFileList", fileContainer.files, { shouldDirty: true });
          formContext.setValue("logoFile", UPLOAD_NEW_ID, { shouldDirty: true });
          event.currentTarget.value = "";
        }}
      />
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={{
          logoFile: [
            {
              key: UPLOAD_NEW_ID,
              label: "admin-brand:upload_new_logo",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            {
              key: REMOVE_LOGO_ID,
              label: "admin:none",
              value: REMOVE_LOGO_ID,
              icon: <ClearIcon />,
            },
            ...(brand.logoPath
              ? [{
                key: KEEP_CURRENT_ID,
                label: "admin-brand:current_logo",
                value: KEEP_CURRENT_ID,
                avatar: <Avatar src={CONFIG.FILE_URL + brand.logoPath} variant="rounded" />,
              }]
              : []),
          ],
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default UpdateBrandPage;
