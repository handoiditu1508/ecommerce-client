export type RoleView = {
  id: number;
  name: string;
  status: RoleStatus;
};

export enum RoleStatus {
  Active,
  Locked,
}
