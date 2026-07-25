import { CreateUserCommand } from "@/models/apis/user/createUser";
import { UpdateSelfCommand } from "@/models/apis/user/updateSeft";
import { UpdateUserCommand } from "@/models/apis/user/updateUser";
import User from "@/models/entities/User";
import { providesIdTag } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<User, CreateUserCommand>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation<User, UpdateUserCommand>({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body,
      }),
    }),
    getSelf: builder.query<User, void>({
      query: () => "/users/self",
      providesTags: (_result, error, arg) => providesIdTag("User", "self", error),
    }),
    updateSelf: builder.mutation<User, UpdateSelfCommand>({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export default userApi;

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetSelfQuery,
  useUpdateSelfMutation,
} = userApi;
