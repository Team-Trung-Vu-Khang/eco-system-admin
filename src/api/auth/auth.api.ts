import { apiClient } from "../apiClient";
import { authStorage } from "./auth.storage";
import type { AuthProvider } from "./auth.request";
import type { AuthMeResponse } from "./auth.response";
import { PATH } from "../../constants/path.constant";

const DEFAULT_AUTH_PROVIDER: AuthProvider = "center";

export function getAuthToken() {
  return authStorage.getToken();
}

export function setAuthToken(token: string) {
  authStorage.setToken(token);
}

export function clearAuthToken() {
  authStorage.clearToken();
}

export function getDefaultAuthProvider() {
  return DEFAULT_AUTH_PROVIDER;
}

export function buildAuthLoginUrl(
  provider: AuthProvider,
  callbackUrl?: string,
) {
  const url = new URL(apiClient.resolveUrl(`${PATH.AUTH.LOGIN}/${provider}`));

  if (callbackUrl) {
    url.searchParams.set("callback_url", callbackUrl);
  }

  return url.toString();
}

export const authApi = {
  getToken: authStorage.getToken,
  setToken: authStorage.setToken,
  clearToken: authStorage.clearToken,
  getCallbackUrl() {
    return `${window.location.origin}${PATH.AUTH.CALLBACK}`;
  },
  buildLoginUrl(provider: AuthProvider) {
    return buildAuthLoginUrl(
      provider,
      `${window.location.origin}${PATH.AUTH.CALLBACK}`,
    );
  },
  startLogin(provider: AuthProvider) {
    window.location.replace(
      buildAuthLoginUrl(provider, `${window.location.origin}${PATH.AUTH.CALLBACK}`),
    );
  },
  getCallbackToken() {
    return new URLSearchParams(window.location.search).get("token");
  },
  async getMe(token = authStorage.getToken()) {
    return authApi.getCurrentUser(token);
  },
  async getCurrentUser(token = authStorage.getToken()) {
    if (!token) {
      throw new Error("Missing auth token");
    }

    const response = await apiClient.get<AuthMeResponse>(
      PATH.AUTH.ME,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined,
    );

    return response.data;
  },
  async logout() {
    const token = authStorage.getToken();

    if (!token) {
      window.location.replace(PATH.APP.HOME);
      return;
    }

    try {
      await apiClient.post(
        PATH.AUTH.LOGOUT,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            post_logout_redirect_uri: `${window.location.origin}${PATH.APP.HOME}`,
          },
        },
      );
    } catch {
      // Ignore logout API failures and still continue to redirect.
    } finally {
      authStorage.clearToken();
      window.location.replace(PATH.APP.HOME);
    }
  },
  getDefaultProvider() {
    return DEFAULT_AUTH_PROVIDER;
  },
};
