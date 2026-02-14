import { isValidationProblemDetails, KnownApiError } from "@/models/apis/common";
import { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string; } = { baseUrl: "" }
): BaseQueryFn<
  string | Pick<AxiosRequestConfig, "method" | "params" | "headers"> & {
    url: string;
    body?: AxiosRequestConfig["data"];
  },
  unknown,
  FetchBaseQueryError & {
    /**
     * Optional error code returned by the API.
     */
    code?: string;
  }
> => async (arg) => {
  try {
    const result = typeof arg === "string"
      ? await axios(baseUrl + arg)
      : await axios({
        url: baseUrl + arg.url,
        method: arg.method,
        data: arg.body,
        params: arg.params,
        headers: arg.headers,
      });

    return { data: result.data };
  } catch (axiosError) {
    // convert AxiosError to FetchBaseQueryError so that axiosBaseQuery can replace fetchBaseQuery with minimal changes
    const err = axiosError as AxiosError<KnownApiError>;

    if (err.response) {
      if (err.code === "ERR_BAD_RESPONSE") {
        return {
          error: {
            status: "PARSING_ERROR",
            originalStatus: err.response.status,
            data: JSON.stringify(err.response.data),
            error: err.message,
          },
        };
      }

      if (isValidationProblemDetails(err.response.data)) {
        return {
          error: {
            status: "FETCH_ERROR",
            error: err.response.data.title ?? "Error sending request, please try again later.",
          },
        };
      }

      return {
        error: {
          status: err.response.status,
          error: err.response.data.message,
          data: err.response.data,
          code: err.response.data.code,
        },
      };
    }

    if (err.status) {
      return {
        error: {
          status: err.status,
          data: err.message,
        },
      };
    }

    switch (err.code) {
      case "ERR_BAD_OPTION_VALUE":
      case "ERR_BAD_OPTION":
      case "ERR_NETWORK":
      case "ERR_FR_TOO_MANY_REDIRECTS":
      case "ERR_DEPRECATED":
      case "ERR_BAD_REQUEST":
      case "ERR_CANCELED":
      case "ERR_NOT_SUPPORT":
      case "ERR_INVALID_URL":
        return {
          error: {
            status: "FETCH_ERROR",
            error: err.message,
          },
        };
      case "ECONNABORTED":
      case "ETIMEDOUT":
        return {
          error: {
            status: "TIMEOUT_ERROR",
            error: err.message,
          },
        };
    }

    return {
      error: {
        status: "CUSTOM_ERROR",
        error: err.message,
      },
    };
  }
};

export default axiosBaseQuery;
