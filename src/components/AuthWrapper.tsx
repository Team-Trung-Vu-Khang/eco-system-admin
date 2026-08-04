import { type ReactNode, useEffect, useState } from "react";
import { AuthLoadingState } from "./AuthLoadingState";
import { PATH } from "@/constants/path.constant";
import { authApi } from "@/api/auth/auth.api";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const isCallbackRoute = window.location.pathname.startsWith(
    PATH.AUTH.CALLBACK,
  );
  const run = async () => {
    try {
      if (isCallbackRoute) {
        const tokenFromUrl = authApi.getCallbackToken();
        console.log(tokenFromUrl);
        if (!tokenFromUrl) {
          authApi.startLogin(authApi.getDefaultProvider());
          return;
        }

        authApi.setToken(tokenFromUrl);
        window.location.replace("/");
        return;
      }

      const token = authApi.getToken();
      console.log(token);
      if (!token) {
        authApi.startLogin(authApi.getDefaultProvider());
        return;
      }

      setIsReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    run();
  }, [isCallbackRoute]);

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
