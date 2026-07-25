import Policy from "../Policy";

export type RoleView = {
  id: number;
  name: string;
  status: RoleStatus;
};

type Role = {
  id: number;
  name: string;
  status: RoleStatus;
  policies: Policy[];
};

export enum RoleStatus {
  Active,
  Locked,
}

export default Role;
