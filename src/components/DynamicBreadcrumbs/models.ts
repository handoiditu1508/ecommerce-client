import { ReactNode } from "react";
import { To } from "react-router-dom";

export type BreadcrumbsItem = {
  to?: To;
  label?: string;
  icon?: ReactNode;
};
