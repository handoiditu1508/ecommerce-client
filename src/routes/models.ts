import { ReactNode } from "react";
import { To } from "react-router-dom";

export type CrumbData = {
  to?: To;
  label?: string;
  icon?: ReactNode;
};

export type RouteHandleObject = {
  crumb?: CrumbData | ((data: any) => CrumbData);
  hideBreadcrumbs?: boolean;
};
