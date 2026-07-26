import { UserStatus } from "@/models/entities/User";
import { PageFilter, SortFilter } from "../common";

export type GetUsersQuery = SortFilter & PageFilter & CountUsersQuery;

export type CountUsersQuery = {
  emailConfirmed?: boolean;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnabled?: boolean;
  redirectEmailEnabled?: boolean;
  isDeleted?: boolean;
  accessFailedCount?: boolean;
  statuses?: UserStatus[];
  roles?: number[];
  createdDate?: Date;
  modifiedDate?: Date;
  deletedDate?: Date;
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
};
