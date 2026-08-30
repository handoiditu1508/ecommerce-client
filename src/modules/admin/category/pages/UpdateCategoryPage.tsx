import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateCategoryCommand } from "@/models/apis/category/updateCategory";
import { useGetCategoryQuery, useUpdateCategoryMutation } from "@/redux/apis/categoryApi";
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
const REMOVE_ICON_ID = "remove-icon";
const KEEP_CURRENT_ID = "keep-current";

type UpdateCategoryForm = Omit<UpdateCategoryCommand, "iconFile"> & {
  iconFile: string;
  iconFileList?: FileList;
};

const formModel: DynamicFormModel<UpdateCategoryForm> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin-category:category_name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    { name: "iconFile", inputType: "select", label: "admin-category:icon", options: [] },
  ],
  submitButtonText: "admin-category:update_category",
};

function UpdateCategoryPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-category", "translation", "admin"]);
  const categoryResult = useGetCategoryQuery({ categoryId: id }, { skip: !Number.isInteger(id) });
  const [updateCategory, updateResult] = useUpdateCategoryMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousIconSelectionRef = useRef<string | undefined>(undefined);
  const formValues = useMemo<UpdateCategoryForm | undefined>(() => (
    categoryResult.data
      ? {
        id: categoryResult.data.id,
        name: categoryResult.data.name,
        iconFile: categoryResult.data.iconPath ? KEEP_CURRENT_ID : REMOVE_ICON_ID,
        iconFileList: undefined,
        isRemoveIcon: false,
      }
      : undefined
  ), [categoryResult.data]);
  const formContext = useForm<UpdateCategoryForm>({ values: formValues });
  const category = categoryResult.data;
  const iconSelection = formContext.watch("iconFile");
  const defaultIconSelection = category?.iconPath ? KEEP_CURRENT_ID : REMOVE_ICON_ID;

  const setFileInputRef = useCallback((fileInput: HTMLInputElement | null) => {
    fileInputRef.current = fileInput;

    const handleFileSelectionCancel = () => {
      formContext.setValue("iconFile", previousIconSelectionRef.current ?? defaultIconSelection);
    };
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputRef.current === fileInput) fileInputRef.current = null;
    };
  }, [defaultIconSelection, formContext]);

  // Open the file picker when the upload option is selected.
  useEffect(() => {
    if (iconSelection === UPLOAD_NEW_ID && previousIconSelectionRef.current !== undefined) {
      fileInputRef.current?.click();
    }
    previousIconSelectionRef.current = iconSelection;
  }, [iconSelection]);

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_category_id")}</Alert>;
  if (categoryResult.isLoading) return <CircularProgress />;
  if (!category) return <Alert severity="error">{t("unable_to_load_category")}</Alert>;

  const handleSubmit = async (data: UpdateCategoryForm) => {
    const command: UpdateCategoryCommand = {
      id: data.id,
      name: data.name,
      iconFile: data.iconFile === UPLOAD_NEW_ID ? data.iconFileList : undefined,
      isRemoveIcon: data.iconFile === REMOVE_ICON_ID,
    };
    try {
      await updateCategory(command).unwrap();
      dispatch(pushNotification({
        text: t("category_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_category")}</Typography>
      <input
        ref={setFileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = event.currentTarget.files;
          const file = files?.item(0);

          if (!files?.length || !file) {
            formContext.setValue("iconFile", previousIconSelectionRef.current ?? defaultIconSelection);

            return;
          }

          const fileContainer = new DataTransfer();
          fileContainer.items.add(file);
          formContext.setValue("iconFileList", fileContainer.files, { shouldDirty: true });
          formContext.setValue("iconFile", UPLOAD_NEW_ID, { shouldDirty: true });
          event.currentTarget.value = "";
        }}
      />
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={{
          iconFile: [
            {
              key: UPLOAD_NEW_ID,
              label: "admin-category:upload_new_icon",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            {
              key: REMOVE_ICON_ID,
              label: "admin:none",
              value: REMOVE_ICON_ID,
              icon: <ClearIcon />,
            },
            ...(category.iconPath
              ? [{
                key: KEEP_CURRENT_ID,
                label: "admin-category:current_icon",
                value: KEEP_CURRENT_ID,
                avatar: <Avatar src={CONFIG.FILE_URL + category.iconPath} variant="rounded" />,
              }]
              : []),
          ],
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default UpdateCategoryPage;
