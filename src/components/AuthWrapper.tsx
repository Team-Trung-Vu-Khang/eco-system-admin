import { useEffect, useState, type ReactNode } from "react";
import { AuthLoadingState } from "@/components/AuthLoadingState";
import {
  authApi,
  clearAuthToken,
  getAuthToken,
} from "@/api/auth/auth.api";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEY } from "@/constants/query-key.constant";
import { PATH } from "@/constants/path.constant";

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const isLoginRoute = currentUrl.pathname.startsWith(PATH.AUTH.LOGIN);
    const isCallbackRoute = currentUrl.pathname.startsWith(PATH.AUTH.CALLBACK);
    const tokenFromUrl = currentUrl.searchParams.get("token");
    const storedToken = getAuthToken();

    if (isCallbackRoute) {
      if (tokenFromUrl) {
        authApi.setToken(tokenFromUrl);
        queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, tokenFromUrl);
        currentUrl.searchParams.delete("token");
        window.history.replaceState(
          {},
          "",
          `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
        );
        window.location.replace(PATH.APP.HOME);
        return;
      }

      if (storedToken) {
        queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, storedToken);
        window.location.replace(PATH.APP.HOME);
        return;
      }

      clearAuthToken();
      authApi.startLogin(authApi.getDefaultProvider());
      return;
    }

    if (isLoginRoute) {
      if (storedToken) {
        queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, storedToken);
        window.location.replace(PATH.APP.HOME);
        return;
      }

      setIsReady(true);
      return;
    }

    if (storedToken) {
      queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, storedToken);
      setIsReady(true);
      return;
    }

    clearAuthToken();
    authApi.startLogin(authApi.getDefaultProvider());
  }, []);

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
