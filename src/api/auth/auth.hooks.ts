import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { authStorage } from "./auth.storage";
import type { AuthLoginRequest } from "./auth.request";
import type { AuthLoginResult, AuthLoginTokenResponse } from "./auth.response";
import { PATH } from "../../constants/path.constant";
import { QUERY_KEY } from "../../constants/query-key.constant";
import { buildAuthLoginUrl } from "./auth.api";

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

  const response = await apiClient.request<AuthLoginTokenResponse>(
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
        authStorage.setToken(result.token);
      }
    },
  });
}
