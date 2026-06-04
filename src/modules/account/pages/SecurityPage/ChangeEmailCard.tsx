import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { ChangeEmailCommand } from "@/models/apis/auth/changeEmail";
import { useChangeEmailMutation } from "@/redux/apis/authApi";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

const changeEmailModel: DynamicFormModel<ChangeEmailCommand> = {
  inputs: [
    {
      name: "newEmail",
      inputType: "text",
      label: "New Email",
      required: true,
      rules: { required: "Email is required" },
    },
    {
      name: "password",
      inputType: "password",
      label: "Password",
      required: true,
      rules: { required: "Password is required" },
    },
  ],
};

function ChangeEmailCard() {
  const changeEmailForm = useForm<ChangeEmailCommand>({ defaultValues: { newEmail: "", password: "" } });
  const [changeEmail, changeEmailResult] = useChangeEmailMutation();

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Change Email</Typography>
        <DynamicForm id="change-email-form" formContext={changeEmailForm} model={changeEmailModel} loading={changeEmailResult.isLoading} onSubmit={changeEmail} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button type="submit" form="change-email-form" variant="text" loading={changeEmailResult.isLoading}>Change Email</Button>
      </CardActions>
    </Card>
  );
}

export default ChangeEmailCard;
