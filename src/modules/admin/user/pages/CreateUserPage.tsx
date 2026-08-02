import { DynamicGridForm, DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CreateUserCommand } from "@/models/apis/user/createUser";
import { UserStatus } from "@/models/entities/User";
import { useCreateUserMutation } from "@/redux/apis/userApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formModel: DynamicFormModel<CreateUserCommand> = {
  inputs: [
    {
      name: "username",
      inputType: "text",
      label: "user:username",
      required: true,
      rules: { required: "user:this_field_is_required" },
      size: { sm: 6 },
    },
    {
      name: "email",
      inputType: "email",
      label: "user:email",
      required: true,
      rules: { required: "user:this_field_is_required" },
      size: { sm: 6 },
    },
    { name: "emailConfirmed", inputType: "checkbox", label: "user:email_confirmed", size: { sm: 6 } },
    {
      name: "firstName",
      inputType: "text",
      label: "user:first_name",
      required: true,
      maxLength: CONFIG.NAME_MAX_LENGTH,
      rules: { required: "user:this_field_is_required" },
      size: { sm: 4 },
    },
    {
      name: "middleName",
      inputType: "text",
      label: "user:middle_name_optional",
      maxLength: CONFIG.NAME_MAX_LENGTH,
      size: { sm: 4 },
    },
    {
      name: "lastName",
      inputType: "text",
      label: "user:last_name",
      required: true,
      maxLength: CONFIG.NAME_MAX_LENGTH,
      rules: { required: "user:this_field_is_required" },
      size: { sm: 4 },
    },
  ],
  submitButtonText: "user:create_user",
};

function CreateUserPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("user");
  const [createUser, result] = useCreateUserMutation();
  const formContext = useForm<CreateUserCommand>({
    defaultValues: {
      id: 0,
      username: "",
      email: "",
      phoneNumber: undefined,
      firstName: "",
      middleName: "",
      lastName: "",
      lockoutEnd: undefined,
      lockoutEnabled: false,
      accessFailedCount: 0,
      status: UserStatus.Active,
      roles: [],
      policies: [],
      emailConfirmed: false,
      redirectEmailEnabled: false,
      twoFactorEnabled: false,
      isDeleted: false,
      deletedDate: undefined,
    },
  });

  const handleSubmit = async (data: CreateUserCommand) => {
    try {
      await createUser({ ...data, middleName: data.middleName || undefined }).unwrap();
      dispatch(pushNotification({ text: t("user_created_successfully"), severity: "success" }));
      navigate("/admin/users");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("create_user")}</Typography>
      <DynamicGridForm formContext={formContext} model={formModel} loading={result.isLoading} gridProps={{ spacing: 2 }} onSubmit={handleSubmit} />
    </Paper>
  );
}

export default CreateUserPage;
