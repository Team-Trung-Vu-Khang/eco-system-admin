import { useEffect, useState, type ReactNode } from "react";
import { AuthLoadingState } from "@/components/AuthLoadingState";
import {
  buildAuthLoginUrl,
  clearAuthToken,
  getAuthToken,
  getDefaultAuthProvider,
  setAuthToken,
} from "@/api/auth/auth";
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

    let isMounted = true;
    const currentUrl = new URL(window.location.href);
    const isCallbackRoute = currentUrl.pathname.startsWith(PATH.AUTH.CALLBACK);
    const tokenFromUrl = currentUrl.searchParams.get("token");
    const storedToken = getAuthToken();

    const redirectToLogin = () => {
      const callbackUrl = `${window.location.origin}${PATH.AUTH.CALLBACK}`;
      window.location.replace(
        buildAuthLoginUrl(getDefaultAuthProvider(), callbackUrl),
      );
    };

    if (isCallbackRoute) {
      if (tokenFromUrl) {
        setAuthToken(tokenFromUrl);
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
      redirectToLogin();
      return;
    }

    if (storedToken) {
      queryClient.setQueryData(QUERY_KEY.AUTH.SESSION, storedToken);
      if (isMounted) {
        setIsReady(true);
      }
      return;
    }

    clearAuthToken();
    redirectToLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
