import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { ChangeEmailCommand } from "@/models/apis/auth/changeEmail";
import { useChangeEmailMutation } from "@/redux/apis/authApi";
import { authSelectors } from "@/redux/slices/authSlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

function ChangeEmailCard() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["account", "translation"]);
  const authUser = useAppSelector(authSelectors.user);
  const changeEmailForm = useForm<ChangeEmailCommand>({ defaultValues: { newEmail: authUser?.email ?? "", password: "" } });
  const [changeEmail, changeEmailResult] = useChangeEmailMutation();

  const changeEmailModel: DynamicFormModel<ChangeEmailCommand> = {
    inputs: [
      {
        name: "newEmail",
        inputType: "text",
        label: t("new_email"),
        required: true,
        rules: {
          required: t("translation:this_field_is_required"),
          validate: (value) => value !== authUser?.email || t("email_must_be_different"),
        },
      },
      {
        name: "password",
        inputType: "password",
        label: t("password"),
        required: true,
        rules: { required: t("translation:this_field_is_required") },
      },
    ],
  };

  const handleChangeEmail = async (data: ChangeEmailCommand) => {
    try {
      await changeEmail(data).unwrap();
      dispatch(pushNotification({
        text: t("verification_email_sent"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>{t("change_email")}</Typography>
        <DynamicForm id="change-email-form" formContext={changeEmailForm} model={changeEmailModel} loading={changeEmailResult.isLoading} onSubmit={handleChangeEmail} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-email-form" variant="text" loading={changeEmailResult.isLoading}>{t("change_email")}</Button>
      </CardActions>
    </Card>
  );
}

export default ChangeEmailCard;
