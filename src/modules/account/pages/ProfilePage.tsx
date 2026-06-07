import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateSelfCommand } from "@/models/apis/user/updateSeft";
import { useUpdateSelfMutation } from "@/redux/apis/userApi";
import { authSelectors } from "@/redux/slices/authSlice";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();
  const { t: tAccount } = useTranslation("account");
  const authUser = useAppSelector(authSelectors.user);

  const formModel: DynamicFormModel<UpdateSelfCommand> = {
    inputs: [
      {
        name: "firstName",
        inputType: "text",
        label: tAccount("first_name"),
        maxLength: CONFIG.NAME_MAX_LENGTH,
        required: true,
        rules: {
          required: t("this_field_is_required"),
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAccount("invalid_name"),
          },
        },
      },
      {
        name: "middleName",
        inputType: "text",
        label: tAccount("middle_name"),
        maxLength: CONFIG.NAME_MAX_LENGTH,
        rules: {
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAccount("invalid_name"),
          },
        },
      },
      {
        name: "lastName",
        inputType: "text",
        label: tAccount("last_name"),
        maxLength: CONFIG.NAME_MAX_LENGTH,
        required: true,
        rules: {
          required: t("this_field_is_required"),
          pattern: {
            value: /^[A-Za-z]+$/,
            message: tAccount("invalid_name"),
          },
        },
      },
    ],
  };

  const formContext = useForm<UpdateSelfCommand>({
    defaultValues: {
      firstName: authUser?.firstName ?? "",
      middleName: authUser?.middleName ?? "",
      lastName: authUser?.lastName ?? "",
      phoneNumber: authUser?.phoneNumber ?? undefined,
    },
  });
  const [updateSelf, updateSelfResult] = useUpdateSelfMutation();

  return (
    <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 4 }}>{tAccount("profile_information")}</Typography>
        <DynamicForm
          id="profile-form"
          formContext={formContext}
          model={formModel}
          loading={updateSelfResult.isLoading}
          onSubmit={updateSelf}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          type="submit"
          form="profile-form"
          variant="text"
          loading={updateSelfResult.isLoading}>
          {tAccount("save_changes")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProfilePage;
