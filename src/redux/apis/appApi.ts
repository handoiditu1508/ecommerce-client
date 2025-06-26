import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";
import reauthBaseQueryWrapper from "../utils/reauthBaseQueryWrapper";
import { allTags } from "../utils/rtkQueryCacheUtils";

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: reauthBaseQueryWrapper(axiosBaseQuery({ baseUrl: "/api/" })),
  tagTypes: allTags,
  endpoints: (builder) => ({
    refetchErrorQueries: builder.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["UNKNOWN_ERROR"],
    }),
  }),
});

export default appApi;

export const {
  useRefetchErrorQueriesMutation,
} = appApi;
