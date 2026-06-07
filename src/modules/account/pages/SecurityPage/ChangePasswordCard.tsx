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
import { useTranslation } from "react-i18next";

function ChangePasswordCard() {
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const changePasswordForm = useForm<ChangePasswordCommand>({ defaultValues: { currentPassword: "", newPassword: "" } });
  const [changePassword, changePasswordResult] = useChangePasswordMutation();
  const passwordValidation = validatePassword(changePasswordForm.watch("newPassword"));

  const changePasswordModel: DynamicFormModel<ChangePasswordCommand> = {
    inputs: [
      {
        name: "currentPassword",
        inputType: "password",
        label: tAccount("current_password"),
        required: true,
        rules: {
          required: t("this_field_is_required"),
          validate: (value, formValues) => value !== formValues.newPassword || tAccount("password_must_be_different"),
        },
      },
      {
        name: "newPassword",
        inputType: "password",
        label: tAccount("new_password"),
        required: true,
        rules: { required: t("this_field_is_required") },
      },
    ],
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>{tAccount("change_password")}</Typography>
        <DynamicForm id="change-password-form" formContext={changePasswordForm} model={changePasswordModel} loading={changePasswordResult.isLoading} onSubmit={changePassword} />
        <PasswordValidatonDisplayer validationResult={passwordValidation} sx={{ mt: 2 }} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-password-form" variant="text" loading={changePasswordResult.isLoading}>{tAccount("change_password")}</Button>
      </CardActions>
    </Card>
  );
}

export default ChangePasswordCard;
