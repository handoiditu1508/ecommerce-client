import Policy from "@/models/Policy";
import { ReactNode } from "react";
import { To } from "react-router-dom";

export type CrumbData = {
  to?: To;
  label?: string;
  icon?: ReactNode;
};

export type RouteHandleObject = {
  crumb?: CrumbData | ((data: unknown) => CrumbData);
  hideBreadcrumbs?: boolean;
  /**
   * Policies which page is protected with.
   */
  policies?: Policy[];
  /**
   * Page require authentication.
   */
  requireAuth?: boolean;
};
