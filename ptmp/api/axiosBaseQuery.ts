import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import { api } from "../api.ts";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  params?: Record<string, string | number>;
};

export type AxiosBaseQueryError = {
  status?: number;
  message: string;
};

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "get", params }) => {
    try {
      const { data } = await api.request({ url, method, params });

      return { data };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status,
            message: error.message,
          },
        };
      }

      return { error: { message: "Error desconocido al llamar a la API" } };
    }
  };
