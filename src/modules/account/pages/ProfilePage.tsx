import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import CONFIG from "@/configs";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateSelfCommand } from "@/models/apis/user/updateSeft";
import { useUpdateSelfMutation } from "@/redux/apis/userApi";
import { authSelectors } from "@/redux/slices/authSlice";
import { useForm } from "react-hook-form";

const formModel: DynamicFormModel<UpdateSelfCommand> = {
  submitButtonText: "Save",
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
    <DynamicForm
      formContext={formContext}
      model={formModel}
      loading={updateSelfResult.isLoading}
      onSubmit={updateSelf}
    />
  );
}

export default ProfilePage;
