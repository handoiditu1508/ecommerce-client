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
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const authUser = useAppSelector(authSelectors.user);
  const changeEmailForm = useForm<ChangeEmailCommand>({ defaultValues: { newEmail: authUser?.email ?? "", password: "" } });
  const [changeEmail, changeEmailResult] = useChangeEmailMutation();

  const changeEmailModel: DynamicFormModel<ChangeEmailCommand> = {
    inputs: [
      {
        name: "newEmail",
        inputType: "text",
        label: tAccount("new_email"),
        required: true,
        rules: {
          required: t("this_field_is_required"),
          validate: (value) => value !== authUser?.email || tAccount("email_must_be_different"),
        },
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

  const handleChangeEmail = async (data: ChangeEmailCommand) => {
    try {
      await changeEmail(data).unwrap();
      dispatch(pushNotification({
        text: tAccount("verification_email_sent"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>{tAccount("change_email")}</Typography>
        <DynamicForm id="change-email-form" formContext={changeEmailForm} model={changeEmailModel} loading={changeEmailResult.isLoading} onSubmit={handleChangeEmail} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-email-form" variant="text" loading={changeEmailResult.isLoading}>{tAccount("change_email")}</Button>
      </CardActions>
    </Card>
  );
}

export default ChangeEmailCard;
