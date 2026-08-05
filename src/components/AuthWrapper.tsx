import { type ReactNode, useEffect, useState } from "react";
import { AuthLoadingState } from "./AuthLoadingState";
import { PATH } from "@/constants/path.constant";
import { authApi } from "@/api/auth/auth.api";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isCallbackRoute = window.location.pathname.startsWith(
    PATH.AUTH.CALLBACK,
  );
  const run = async () => {
    try {
      if (isCallbackRoute) {
        const errorFromUrl = authApi.getCallbackError();
        if (errorFromUrl === "account_inactive") {
          setAuthError("Tài khoản của bạn đã bị khoá.");
          return;
        }

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

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Lỗi Đăng Nhập</h2>
          <p className="mt-2 text-sm text-red-600">{authError}</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
