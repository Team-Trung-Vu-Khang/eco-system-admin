export type AuthProvider = "center" | "farm";

export type AuthLoginRequest = {
  provider: AuthProvider;
  callbackUrl?: string;
};
