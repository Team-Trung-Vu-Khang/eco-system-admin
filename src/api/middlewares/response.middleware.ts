import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { AUTH_POST_LOGOUT_REDIRECT_URL } from "@/constants/api.constant";
import { PATH } from "@/constants/path.constant";
import { authStorage } from "@/api/auth/auth.storage";
import { refreshAccessToken } from "@/api/auth/auth.refresh";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export function attachApiResponseMiddleware(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const status = error.response?.status;
      const originalRequest = error.config as RetryConfig | undefined;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes(PATH.AUTH.REFRESH)) {
        authStorage.clearToken();
        window.location.replace(AUTH_POST_LOGOUT_REDIRECT_URL || "/");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          originalRequest._retry = true;
          originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
          originalRequest.headers.set("Authorization", `Bearer ${token}`);

          return client.request(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        authStorage.setToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

        return client.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStorage.clearToken();
        window.location.replace(AUTH_POST_LOGOUT_REDIRECT_URL || "/");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
