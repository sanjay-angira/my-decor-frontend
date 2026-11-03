import axios, { type AxiosRequestConfig } from "axios";
import { axiosInstance } from "./config";
import { ApiError } from "./errors";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type RequestOptions = {
  auth?: boolean;
  signal?: AbortSignal;
};

function requestConfig(options?: RequestOptions): AxiosRequestConfig & {
  skipAuth?: boolean;
} {
  const config: AxiosRequestConfig & { skipAuth?: boolean } =
    options?.auth === false ? { skipAuth: true } : {};
  if (options?.signal) config.signal = options.signal;
  return config;
}

function toApiError(error: unknown): Error {
  if (axios.isCancel(error)) return error as Error;
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const raw = data?.message;
    const message = Array.isArray(raw)
      ? raw.filter(Boolean).join(", ") || error.message
      : typeof raw === "string" && raw.trim()
        ? raw
        : error.message;
    return new ApiError(message || "Request failed", error.response?.status);
  }
  return error instanceof Error ? error : new ApiError("Request failed");
}

async function request<T>(operation: () => Promise<{ data: T }>): Promise<T> {
  try {
    const response = await operation();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
    throw toApiError(error);
  }
}

export function getData<T = unknown>(
  url: string,
  params?: QueryParams,
  options?: RequestOptions,
): Promise<T> {
  return request(() =>
    axiosInstance.get<T>(url, { params, ...requestConfig(options) }),
  );
}

export function postData<T = unknown>(
  url: string,
  data?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request(() =>
    axiosInstance.post<T>(url, data, requestConfig(options)),
  );
}

export function putData<T = unknown>(
  url: string,
  data?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request(() =>
    axiosInstance.put<T>(url, data, requestConfig(options)),
  );
}

export function patchData<T = unknown>(
  url: string,
  data?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request(() =>
    axiosInstance.patch<T>(url, data, requestConfig(options)),
  );
}

export function deleteData<T = unknown>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  return request(() =>
    axiosInstance.delete<T>(url, requestConfig(options)),
  );
}
