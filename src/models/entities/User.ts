import Policy from "../Policy";
import { RoleView } from "./Role";

type User = {
  id: number;
  username: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  status: UserStatus;
  roles: RoleView[];
  policies: Policy[];
  emailConfirmed: boolean;
  redirectEmailEnabled: boolean;
  avatarPath?: string;
  twoFactorEnabled: boolean;
  isDeleted: boolean;
  deletedDate?: string;
};

export type UserView = {
  id: number;
  username: string;
  email?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  status: UserStatus;
  createdDate: Date;
  modifiedDate: Date;
  isDeleted: boolean;
  roles: RoleView[];
};

export enum UserStatus {
  Active,
  Locked,
}

export default User;
