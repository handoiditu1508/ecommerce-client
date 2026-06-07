import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { ChangeEmailCommand } from "@/models/apis/auth/changeEmail";
import { useChangeEmailMutation } from "@/redux/apis/authApi";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

function ChangeEmailCard() {
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const changeEmailForm = useForm<ChangeEmailCommand>({ defaultValues: { newEmail: "", password: "" } });
  const [changeEmail, changeEmailResult] = useChangeEmailMutation();

  const changeEmailModel: DynamicFormModel<ChangeEmailCommand> = {
    inputs: [
      {
        name: "newEmail",
        inputType: "text",
        label: tAccount("new_email"),
        required: true,
        rules: { required: t("this_field_is_required") },
      },
      {
        name: "password",
        inputType: "password",
        label: tAccount("password"),
        required: true,
        rules: { required: t("this_field_is_required") },
      },
    ],
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>{tAccount("change_email")}</Typography>
        <DynamicForm id="change-email-form" formContext={changeEmailForm} model={changeEmailModel} loading={changeEmailResult.isLoading} onSubmit={changeEmail} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-email-form" variant="text" loading={changeEmailResult.isLoading}>{tAccount("change_email")}</Button>
      </CardActions>
    </Card>
  );
}

export default ChangeEmailCard;
