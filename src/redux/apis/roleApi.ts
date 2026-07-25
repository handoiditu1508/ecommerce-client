import { CountRolesQuery, GetRolesQuery } from "@/models/apis/role/getRoles";
import { RoleView } from "@/models/entities/Role";
import appApi from "./appApi";

const roleApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleView[], GetRolesQuery>({
      query: (arg) => ({
        url: "/roles",
        method: "GET",
        params: arg,
      }),
    }),
    countRoles: builder.query<number, CountRolesQuery>({
      query: (arg) => ({
        url: "/roles/count",
        method: "GET",
        params: arg,
      }),
    }),
  }),
});

export default roleApi;

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useCountRolesQuery,
  useLazyCountRolesQuery,
} = roleApi;
