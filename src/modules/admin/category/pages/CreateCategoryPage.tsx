import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { CreateCategoryCommand } from "@/models/apis/category/createCategory";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import { useCreateCategoryMutation, useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateCategoryCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin-category:category_name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "parentId",
      inputType: "cascadingselect",
      label: "admin-category:parent_category",
      options: [],
    },
    {
      name: "iconFile",
      inputType: "file",
      label: "admin-category:icon",
      accept: "image/*",
    },
  ],
  submitButtonText: "admin:create_category",
};

function CreateCategoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-category", "translation", "admin"]);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<CreateCategoryCommand, "parentId">[]>(
    () => categoriesToDynamicInputOptions<CreateCategoryCommand, "parentId">(categories),
    [categories]
  );
  const [createCategory, result] = useCreateCategoryMutation();
  const formContext = useForm<CreateCategoryCommand>({
    defaultValues: {
      name: "",
      parentId: undefined,
      iconFile: undefined,
    },
  });

  const handleSubmit = async (data: CreateCategoryCommand) => {
    try {
      await createCategory(data).unwrap();
      dispatch(pushNotification({
        text: t("category_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/categories");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("create_category")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        optionsMap={{
          parentId: categoryOptions,
        }}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateCategoryPage;
