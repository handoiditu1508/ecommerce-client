import { UserStatus } from "@/models/entities/User";

export type UpdateUserCommand = {
  id: number;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  firstName: string;
  middleName?: string;
  lastName: string;
  status: UserStatus;
  redirectEmailEnabled?: boolean;
};
