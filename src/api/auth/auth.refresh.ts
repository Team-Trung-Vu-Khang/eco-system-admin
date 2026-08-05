import { apiClient } from "../apiClient";
import { PATH } from "@/constants/path.constant";
import { authStorage } from "./auth.storage";

type RefreshTokenResponse = string | { access_token?: string; token?: string };

export async function refreshAccessToken() {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Missing auth token");
  }

  const data = await apiClient.post<RefreshTokenResponse>(PATH.AUTH.REFRESH, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const nextToken =
    typeof data === "string" ? data : data.access_token ?? data.token;

  if (!nextToken) {
    throw new Error("Invalid token response");
  }

  return nextToken;
}
