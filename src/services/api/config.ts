import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./API_ENDPOINT";
import { getNewAccessToken } from "./jwt";
import { tokenStorage } from "./storage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080/backend/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

type AuthRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  authRetry?: boolean;
};

let pendingRefresh: Promise<string> | undefined;

function isCustomerRequest(url?: string): boolean {
  const path = url?.replace(/^\/+/, "").split("?")[0] ?? "";
  return path.startsWith("customer/") && !path.startsWith("customer/auth/");
}

function refreshAccessToken(refreshToken: string): Promise<string> {
  if (!pendingRefresh) {
    pendingRefresh = getNewAccessToken(refreshToken, API_BASE_URL).finally(
      () => {
        pendingRefresh = undefined;
      },
    );
  }
  return pendingRefresh;
}

axiosInstance.interceptors.request.use(async (request) => {
  const authRequest = request as AuthRequestConfig;
  if (authRequest.skipAuth || !isCustomerRequest(request.url)) return request;

  const refreshToken = tokenStorage.getRefreshToken();
  let accessToken = tokenStorage.getAccessToken();
  if (!accessToken && refreshToken) {
    accessToken = await refreshAccessToken(refreshToken);
  }
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const request = error.config as AuthRequestConfig | undefined;
    if (
      !request ||
      request.skipAuth ||
      request.authRetry ||
      !isCustomerRequest(request.url) ||
      request.url?.includes(API_ENDPOINTS.CUSTOMER_AUTH.REFRESH_TOKEN)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return Promise.reject(error);

    request.authRetry = true;
    try {
      const accessToken = await refreshAccessToken(refreshToken);
      request.headers.Authorization = `Bearer ${accessToken}`;
      return await axiosInstance.request(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
