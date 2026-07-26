import type { GridSortDirection } from "@mui/x-data-grid/models";

export type KnownApiError = ValidationProblemDetails | Problem;

/**
 * Mirrors of `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`.
 */
export type ValidationProblemDetails = {
  instance?: string;
  details?: string;
  status?: number;
  title?: string;
  traceId?: string;
  type?: string;
  errors: Record<string, string[]>;
};

/**
 * Custom problem details type.
 */
export type Problem = {
  code: string;
  group: ExceptionGroup;
  message: string;
  data: Record<string, unknown | null>;
};

export const isValidationProblemDetails = (error: KnownApiError): error is ValidationProblemDetails => "errors" in error;

export enum ExceptionGroup {
  Database,
  System,
  Validation,
  Authentication,
  Identity,
  Resource,
  Logging,
  Email,
  FileSystem,
  Inventory,
}

export type SendEmailResponse = {
  sentTime: string;
  cooldown: number;
};

export type SortFilter<T = unknown> = {
  sortBy?: keyof T | string;
  sortOrder?: GridSortDirection;
};

export type PageFilter = {
  page?: number;
  pageSize?: number;
};

export type AllPagesFilter = PageFilter & {
  allPages?: boolean;
};
