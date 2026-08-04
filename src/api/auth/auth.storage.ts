const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  },
  setToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  },
};
