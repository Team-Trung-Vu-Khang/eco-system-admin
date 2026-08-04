export type AuthLoginTokenResponse = {
  token: string;
};

export type AuthLoginRedirectResponse = {
  mode: "redirect";
  redirectUrl: string;
};

export type AuthLoginResult =
  | {
      mode: "token";
      token: string;
    }
  | AuthLoginRedirectResponse;
