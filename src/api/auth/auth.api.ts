import { PATH } from "@/constants/path.constant";
import type { AuthProvider } from "./auth.request";
import {
  API_BASE_URL,
  AUTH_POST_LOGOUT_REDIRECT_URL,
} from "@/constants/api.constant";
import { apiClient } from "../apiClient";
import type { AuthMeResponse } from "./auth.response";

const AUTH_TOKEN_STORAGE_KEY = "accessToken";
const buildCallbackUrl = () => `${window.location.origin}${PATH.AUTH.CALLBACK}`;

export function buildAuthLoginUrl(
  provider: AuthProvider,
  callbackUrl = buildCallbackUrl(),
) {
  return `${API_BASE_URL}${PATH.AUTH.LOGIN}/${encodeURIComponent(provider)}?callback_url=${encodeURIComponent(callbackUrl)}`;
}

export const authStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  },
  setToken(token: string) {
    sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  },
};

export const authApi = {
  getToken() {
    return authStorage.getToken();
  },
  setToken(token: string) {
    authStorage.setToken(token);
  },
  clearToken() {
    authStorage.clearToken();
  },
  getCallbackUrl() {
    return buildCallbackUrl();
  },
  buildLoginUrl(provider: AuthProvider) {
    return buildAuthLoginUrl(provider, this.getCallbackUrl());
  },
  startLogin(provider: AuthProvider) {
    window.location.replace(this.buildLoginUrl(provider));
  },
  getCallbackToken() {
    return new URLSearchParams(window.location.search).get("token");
  },
  async getMe(token = authStorage.getToken()) {
    return this.getCurrentUser(token);
  },
  async getCurrentUser(token = authStorage.getToken()) {
    if (!token) {
      throw new Error("Missing auth token");
    }

    const response = await apiClient.get<AuthMeResponse>(PATH.AUTH.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
  async logout() {
    const token = authStorage.getToken();

    if (!token) {
      window.location.replace(AUTH_POST_LOGOUT_REDIRECT_URL);
      return;
    }

    try {
      await apiClient.post(PATH.AUTH.LOGOUT, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          post_logout_redirect_uri: AUTH_POST_LOGOUT_REDIRECT_URL,
        },
      });
    } catch {
      // Ignore logout API failures and still continue to redirect.
    } finally {
      authStorage.clearToken();
      window.location.replace(AUTH_POST_LOGOUT_REDIRECT_URL);
    }
  },
  getDefaultProvider() {
    return "farm" as AuthProvider;
  },
};
