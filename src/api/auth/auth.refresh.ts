import axios from "axios";
import { API_BASE_URL } from "@/constants/api.constant";
import { PATH } from "@/constants/path.constant";
import { authStorage } from "./auth.storage";

type RefreshTokenResponse = string | { access_token?: string; token?: string };

export async function refreshAccessToken() {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Missing auth token");
  }

  const { data } = await axios.post<RefreshTokenResponse>(
    PATH.AUTH.REFRESH,
    null,
    {
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const nextToken =
    typeof data === "string" ? data : data.access_token ?? data.token;

  if (!nextToken) {
    throw new Error("Invalid token response");
  }

  return nextToken;
}
