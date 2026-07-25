import { RoleView } from "@/models/entities/Role";
import { AllPagesFilter, SortFilter } from "../common";

export type GetRolesQuery = SortFilter<RoleView> & AllPagesFilter & CountRolesQuery;

export type CountRolesQuery = {
  id?: number;
  name?: string;
};
