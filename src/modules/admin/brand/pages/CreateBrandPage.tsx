import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CreateBrandCommand } from "@/models/apis/brand/createBrand";
import { useCreateBrandMutation } from "@/redux/apis/brandApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateBrandCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin-brand:brand_name",
      required: true,
      maxLength: CONFIG.ENTITY_NAME_MAX_LENGTH,
      rules: { required: "translation:this_field_is_required" },
    },
    {
      name: "logoFile",
      inputType: "file",
      label: "admin-brand:logo",
      accept: "image/*",
    },
    {
      name: "isTop",
      inputType: "checkbox",
      label: "admin-brand:top_brand",
    },
  ],
  submitButtonText: "admin:create_brand",
};

function CreateBrandPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-brand", "translation", "admin"]);
  const [createBrand, result] = useCreateBrandMutation();
  const formContext = useForm<CreateBrandCommand>({
    defaultValues: {
      name: "",
      logoFile: undefined,
      isTop: false,
    },
  });

  const handleSubmit = async (data: CreateBrandCommand) => {
    try {
      await createBrand(data).unwrap();
      dispatch(pushNotification({
        text: t("brand_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/brands");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_brand")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateBrandPage;
