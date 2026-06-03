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

const formModel: DynamicFormModel<UpdateSelfCommand> = {
  inputs: [
    {
      name: "firstName",
      inputType: "text",
      label: "First Name",
      maxLength: CONFIG.NAME_MAX_LENGTH,
      required: true,
      rules: {
        required: "First name is required",
      },
    },
    {
      name: "middleName",
      inputType: "text",
      label: "Middle Name",
      maxLength: CONFIG.NAME_MAX_LENGTH,
    },
    {
      name: "lastName",
      inputType: "text",
      label: "Last Name",
      maxLength: CONFIG.NAME_MAX_LENGTH,
      required: true,
      rules: {
        required: "Last name is required",
      },
    },
  ],
};

function ProfilePage() {
  const authUser = useAppSelector(authSelectors.user);
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
        <Typography variant="h5" sx={{ mb: 4 }}>Profile Information</Typography>
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
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProfilePage;
