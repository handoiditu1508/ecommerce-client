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
  group: number;
  message: string;
};

export const isValidationProblemDetails = (error: KnownApiError): error is ValidationProblemDetails => "errors" in error;

export type SendEmailResponse = {
  sentTime: string;
  cooldown: number;
};
