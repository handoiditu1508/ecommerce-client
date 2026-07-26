import { CreateUserCommand } from "@/models/apis/user/createUser";
import { CountUsersQuery, GetUsersQuery } from "@/models/apis/user/getUsers";
import { UpdateSelfCommand } from "@/models/apis/user/updateSeft";
import { UpdateUserCommand } from "@/models/apis/user/updateUser";
import User, { UserView } from "@/models/entities/User";
import { invalidatesCountTag, invalidatesIdTag, invalidatesListTag, providesCountTag, providesIdTag, providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserView[], GetUsersQuery>({
      query: (params) => ({ url: "/users", params }),
      providesTags: (result, error) => providesListTags("User", result, error),
    }),
    countUsers: builder.query<number, CountUsersQuery>({
      query: (params) => ({ url: "/users/count", params }),
      providesTags: (_result, error) => providesCountTag("User", error),
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, error, id) => providesIdTag("User", id, error),
    }),
    createUser: builder.mutation<User, CreateUserCommand>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("User", error),
        ...invalidatesCountTag("User", error),
      ],
    }),
    updateUser: builder.mutation<User, UpdateUserCommand>({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, error, body) => invalidatesIdTag("User", body.id, error),
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
  useGetUsersQuery,
  useCountUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetSelfQuery,
  useUpdateSelfMutation,
} = userApi;
