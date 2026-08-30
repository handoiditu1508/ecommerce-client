import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CreateGiftCommand } from "@/models/apis/gift/createGift";
import { useCreateGiftMutation } from "@/redux/apis/giftApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateGiftCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin:name",
      required: true,
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
    {
      name: "thumbnailFile",
      inputType: "file",
      label: "admin-gift:thumbnail",
      accept: "image/*",
      required: true,
      rules: { required: "translation:this_field_is_required" },
    },
  ],
  submitButtonText: "admin:create_gift",
};

function CreateGiftPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-gift", "translation", "admin"]);
  const [createGift, result] = useCreateGiftMutation();
  const formContext = useForm<CreateGiftCommand>({
    defaultValues: {
      name: "",
      quantity: 0,
      thumbnailFile: undefined,
    },
  });

  const handleSubmit = async (data: CreateGiftCommand) => {
    try {
      await createGift(data).unwrap();
      dispatch(pushNotification({
        text: t("gift_created_successfully"),
        severity: "success",
      }));
      navigate("/admin/gifts");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("admin:create_gift")}</Typography>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={result.isLoading}
        onSubmit={handleSubmit}
      />
    </Paper>
  );
}

export default CreateGiftPage;
