import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateUserCommand } from "@/models/apis/user/updateUser";
import User, { UserStatus } from "@/models/entities/User";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/apis/userApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

type UpdateUserForm = UpdateUserCommand & Omit<User, keyof UpdateUserCommand> & { username: string; };

const statusOptions = Object.values(UserStatus)
  .filter((value): value is UserStatus => typeof value === "number")
  .map((value) => ({
    key: value,
    label: value === UserStatus.Active ? "user:active" : "user:locked",
    value,
  }));

const formModel: DynamicFormModel<UpdateUserForm> = {
  inputs: [
    { name: "username", inputType: "text", label: "user:username", readOnly: true, size: { sm: 6 } },
    { name: "email", inputType: "email", label: "user:email", required: true, size: { sm: 6 } },
    { name: "firstName", inputType: "text", label: "user:first_name", required: true, size: { sm: 4 } },
    { name: "middleName", inputType: "text", label: "user:middle_name_optional", size: { sm: 4 } },
    { name: "lastName", inputType: "text", label: "user:last_name", required: true, size: { sm: 4 } },
    { name: "phoneNumber", inputType: "text", label: "user:phone_number", readOnly: true },
    { name: "emailConfirmed", inputType: "checkbox", label: "user:email_confirmed", size: { sm: 6 } },
    {
      name: "redirectEmailEnabled",
      inputType: "checkbox",
      label: "user:redirect_email_enabled",
      size: { sm: 6 },
    },
    { name: "status", inputType: "select", label: "user:status", options: statusOptions, size: { sm: 4 } },
    { name: "isDeleted", inputType: "checkbox", label: "user:deleted", readOnly: true, size: { sm: 4 } },
    {
      name: "deletedDate",
      inputType: "datetime",
      label: "user:deleted_date",
      readOnly: true,
      size: { sm: 4 },
    },
    { name: "lockoutEnabled", inputType: "checkbox", label: "user:lockout_enabled", size: { sm: 4 } },
    {
      name: "twoFactorEnabled",
      inputType: "checkbox",
      label: "user:two_factor_enabled",
      readOnly: true,
      size: { sm: 4 },
    },
    {
      name: "accessFailedCount",
      inputType: "text",
      label: "user:access_failed_count",
      readOnly: true,
      size: { sm: 4 },
    },
    { name: "lockoutEnd", inputType: "datetime", label: "user:lockout_end" },
  ],
  submitButtonText: "user:update_user",
};

function UpdateUserPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("user");
  const userResult = useGetUserQuery(id, { skip: !Number.isInteger(id) });
  const [updateUser, updateResult] = useUpdateUserMutation();
  const formValues = useMemo<UpdateUserForm | undefined>(() => userResult.data
    ? { ...userResult.data, email: userResult.data.email ?? "" }
    : undefined, [userResult.data]);
  const formContext = useForm<UpdateUserForm>({ values: formValues });

  if (!Number.isInteger(id)) return <Alert severity="error">{t("invalid_user_id")}</Alert>;
  if (userResult.isLoading) return <CircularProgress />;
  if (!userResult.data) return <Alert severity="error">{t("unable_to_load_user")}</Alert>;

  const handleSubmit = async (data: UpdateUserForm) => {
    const command: UpdateUserCommand = {
      id: data.id,
      email: data.email,
      emailConfirmed: data.emailConfirmed,
      phoneNumber: data.phoneNumber,
      lockoutEnd: data.lockoutEnd || undefined,
      lockoutEnabled: data.lockoutEnabled,
      firstName: data.firstName,
      middleName: data.middleName || undefined,
      lastName: data.lastName,
      status: data.status,
      redirectEmailEnabled: data.redirectEmailEnabled,
    };
    try {
      await updateUser(command).unwrap();
      dispatch(pushNotification({ text: t("user_updated_successfully"), severity: "success" }));
      navigate("/admin/users");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_user")}</Typography>
      <DynamicGridForm formContext={formContext} model={formModel} loading={updateResult.isLoading} gridProps={{ spacing: 2 }} onSubmit={handleSubmit} />
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>{t("roles_readonly")}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {userResult.data.roles.length
            ? userResult.data.roles.map((role) => <Chip key={role.id} label={role.name} size="small" />)
            : <Typography color="text.secondary">{t("none")}</Typography>}
        </Box>
        <Typography variant="subtitle2" gutterBottom>{t("policies_readonly")}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {userResult.data.policies.length
            ? userResult.data.policies.map((policy) => <Chip key={policy} label={policy} size="small" variant="outlined" />)
            : <Typography color="text.secondary">{t("none")}</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

export default UpdateUserPage;
