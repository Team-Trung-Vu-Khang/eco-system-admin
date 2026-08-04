import { AxiosHeaders, type AxiosInstance } from "axios";
import { authStorage } from "@/api/auth/auth.storage";

export function attachApiRequestMiddleware(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const token = authStorage.getToken();

    const headers = AxiosHeaders.from(config.headers);

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    config.headers = headers;

    return config;
  });
}
