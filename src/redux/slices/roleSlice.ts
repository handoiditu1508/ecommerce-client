import { RoleView } from "@/models/entities/Role";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import roleApi from "../apis/roleApi";
import { RootState } from "../store";

const roleAdapter = createEntityAdapter<RoleView>({
  sortComparer: (role1, role2) => role1.name.localeCompare(role2.name),
});

const roleSlice = createSlice({
  name: "role",
  initialState: roleAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      roleApi.endpoints.getRoles.matchFulfilled,
      roleAdapter.setMany,
    );
  },
});

const roleAdapterSelectors = roleAdapter.getSelectors<RootState>((state) => state.role);
export const roleSelectors = {
  all: roleAdapterSelectors.selectAll,
  byId: (id: number) => (state: RootState): RoleView | undefined => roleAdapterSelectors.selectById(state, id),
};

export default roleSlice;
