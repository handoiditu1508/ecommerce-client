import { Key, ReactNode } from "react";

export type SupportAction = {
  key: Key;
  label: ReactNode;
  idleIcon?: ReactNode;
  activeIcon?: ReactNode;
  disabled?: boolean;
  bottomDivider?: boolean;
  secondaryText?: string;
  actionHandler?: () => void;
};
