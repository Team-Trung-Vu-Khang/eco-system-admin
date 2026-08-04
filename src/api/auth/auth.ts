import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestJson, resolveApiUrlPath } from "../http";
import type { AuthLoginRequest, AuthProvider } from "./auth.request";
import type { AuthLoginResult, AuthLoginTokenResponse } from "./auth.response";
import { PATH } from "../../constants/path.constant";
import { QUERY_KEY } from "../../constants/query-key.constant";

const AUTH_TOKEN_STORAGE_KEY = "auth.token";
const DEFAULT_AUTH_PROVIDER: AuthProvider = "center";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getDefaultAuthProvider() {
  return DEFAULT_AUTH_PROVIDER;
}

export function buildAuthLoginUrl(
  provider: AuthProvider,
  callbackUrl?: string,
) {
  const url = new URL(resolveApiUrlPath(`${PATH.AUTH.LOGIN}/${provider}`));

  if (callbackUrl) {
    url.searchParams.set("callback_url", callbackUrl);
  }

  return url.toString();
}

export async function initiateAuthLogin({
  provider,
  callbackUrl,
}: AuthLoginRequest): Promise<AuthLoginResult> {
  if (callbackUrl) {
    return {
      mode: "redirect",
      redirectUrl: buildAuthLoginUrl(provider, callbackUrl),
    };
  }

  const response = await requestJson<AuthLoginTokenResponse>(
    `${PATH.AUTH.LOGIN}/${provider}`,
  );

  return {
    mode: "token",
    token: response.token,
  };
}

export function useAuthLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.AUTH.LOGIN,
    mutationFn: initiateAuthLogin,
    onSuccess: (result) => {
      if (result.mode === "token") {
        queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, result.token);
        setAuthToken(result.token);
      }
    },
  });
}
