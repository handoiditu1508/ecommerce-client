import User from "@/models/entities/User";
import { setAuthUser } from "../slices/authSlice";
import { providesIdTag } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSelf: builder.query<User, void>({
      query: () => "users/self",
      providesTags: (_result, error, arg) => providesIdTag("User", "self", error),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setAuthUser(response.data));
        } catch {}
      },
    }),
  }),
});

export default userApi;

export const {
  useGetSelfQuery,
} = userApi;
