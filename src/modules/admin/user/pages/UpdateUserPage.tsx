import { DynamicGridForm, DynamicFormModel } from "@/components/DynamicForm";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type UpdateUserForm = UpdateUserCommand & Omit<User, keyof UpdateUserCommand> & { username: string; };

const statusOptions = Object.values(UserStatus).filter((value): value is UserStatus => typeof value === "number")
  .map((value) => ({ key: value, label: UserStatus[value], value }));
const formModel: DynamicFormModel<UpdateUserForm> = {
  inputs: [
    { name: "username", inputType: "text", label: "Username", readOnly: true, size: { sm: 6 } },
    { name: "email", inputType: "email", label: "Email", required: true, size: { sm: 6 } },
    { name: "emailConfirmed", inputType: "checkbox", label: "Email confirmed", size: { sm: 4 } },
    { name: "lockoutEnabled", inputType: "checkbox", label: "Lockout enabled", size: { sm: 4 } },
    { name: "redirectEmailEnabled", inputType: "checkbox", label: "Redirect email enabled", size: { sm: 4 } },
    { name: "lockoutEnd", inputType: "text", label: "Lockout end", size: { sm: 6 } },
    { name: "status", inputType: "select", label: "Status", options: statusOptions, size: { sm: 6 } },
    { name: "firstName", inputType: "text", label: "First name", required: true, size: { sm: 4 } },
    { name: "middleName", inputType: "text", label: "Middle name (optional)", size: { sm: 4 } },
    { name: "lastName", inputType: "text", label: "Last name", required: true, size: { sm: 4 } },
    { name: "id", inputType: "text", label: "ID", readOnly: true, size: { sm: 4 } },
    { name: "phoneNumber", inputType: "text", label: "Phone number", readOnly: true, size: { sm: 4 } },
    { name: "accessFailedCount", inputType: "text", label: "Access failed count", readOnly: true, size: { sm: 4 } },
    { name: "twoFactorEnabled", inputType: "checkbox", label: "Two-factor enabled", readOnly: true, size: { sm: 4 } },
    { name: "isDeleted", inputType: "checkbox", label: "Deleted", readOnly: true, size: { sm: 4 } },
    { name: "deletedDate", inputType: "text", label: "Deleted date", readOnly: true, size: { sm: 4 } },
  ],
  submitButtonText: "Update user",
};

function UpdateUserPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userResult = useGetUserQuery(id, { skip: !Number.isInteger(id) });
  const [updateUser, updateResult] = useUpdateUserMutation();
  const formContext = useForm<UpdateUserForm>();
  useEffect(() => {
    if (userResult.data) formContext.reset(userResult.data);
  }, [formContext, userResult.data]);

  if (!Number.isInteger(id)) return <Alert severity="error">Invalid user ID.</Alert>;
  if (userResult.isLoading) return <CircularProgress />;
  if (!userResult.data) return <Alert severity="error">Unable to load user.</Alert>;

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
      dispatch(pushNotification({ text: "User updated successfully.", severity: "success" }));
      navigate("/admin/users");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Update user</Typography>
      <DynamicGridForm formContext={formContext} model={formModel} loading={updateResult.isLoading} gridProps={{ spacing: 2 }} onSubmit={handleSubmit} />
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Roles (readonly)</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {userResult.data.roles.length
            ? userResult.data.roles.map((role) => <Chip key={role.id} label={role.name} size="small" />)
            : <Typography color="text.secondary">None</Typography>}
        </Box>
        <Typography variant="subtitle2" gutterBottom>Policies (readonly)</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {userResult.data.policies.length
            ? userResult.data.policies.map((policy) => <Chip key={policy} label={policy} size="small" variant="outlined" />)
            : <Typography color="text.secondary">None</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

export default UpdateUserPage;
