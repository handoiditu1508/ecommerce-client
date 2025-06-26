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
  FetchBaseQueryError
> => async (arg) => {
  try {
    const result = typeof arg === "string"
      ? await axios(baseUrl + arg)
      : await axios({
        url: baseUrl + arg.url,
        method: arg.method,
        data: arg.body,
        params: arg.params,
        headers: arg.params,
      });

    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;

    return {
      error: err.response
        ? {
          status: err.response.status,
          data: err.response.data || err.message,
        }
        : {
          status: "CUSTOM_ERROR",
          error: err.message,
        },
    };
  }
};

export default axiosBaseQuery;
