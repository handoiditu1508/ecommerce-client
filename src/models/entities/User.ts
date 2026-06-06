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
  twoFactorEnabled: boolean;
  isDeleted: boolean;
  deletedDate?: string;
};

export enum UserStatus {
  Active,
  Locked,
}

export default User;
