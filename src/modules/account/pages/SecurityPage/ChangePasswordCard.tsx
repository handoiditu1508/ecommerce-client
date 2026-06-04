import { validatePassword } from "@/common/rule";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import PasswordValidatonDisplayer from "@/components/PasswordValidatonDisplayer";
import { ChangePasswordCommand } from "@/models/apis/auth/changePassword";
import { useChangePasswordMutation } from "@/redux/apis/authApi";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

const changePasswordModel: DynamicFormModel<ChangePasswordCommand> = {
  inputs: [
    {
      name: "currentPassword",
      inputType: "password",
      label: "Current Password",
      required: true,
      rules: {
        required: "Current password is required",
        validate: (value, formValues) => value !== formValues.newPassword || "Current password must be different from new password",
      },
    },
    {
      name: "newPassword",
      inputType: "password",
      label: "New Password",
      required: true,
      rules: { required: "New password is required" },
    },
  ],
};

function ChangePasswordCard() {
  const changePasswordForm = useForm<ChangePasswordCommand>({ defaultValues: { currentPassword: "", newPassword: "" } });
  const [changePassword, changePasswordResult] = useChangePasswordMutation();
  const passwordValidation = validatePassword(changePasswordForm.watch("newPassword"));

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Change Password</Typography>
        <DynamicForm id="change-password-form" formContext={changePasswordForm} model={changePasswordModel} loading={changePasswordResult.isLoading} onSubmit={changePassword} />
        <PasswordValidatonDisplayer validationResult={passwordValidation} sx={{ mt: 2 }} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-password-form" variant="text" loading={changePasswordResult.isLoading}>Change Password</Button>
      </CardActions>
    </Card>
  );
}

export default ChangePasswordCard;
