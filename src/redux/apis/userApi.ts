import { UpdateSelfCommand } from "@/models/apis/user/updateSeft";
import User from "@/models/entities/User";
import { providesIdTag } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSelf: builder.query<User, void>({
      query: () => "/users/self",
      providesTags: (_result, error, arg) => providesIdTag("User", "self", error),
    }),
    updateSelf: builder.mutation<User, UpdateSelfCommand>({
      query: (body) => ({
        url: "/users/self",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export default userApi;

export const {
  useGetSelfQuery,
  useUpdateSelfMutation,
} = userApi;
