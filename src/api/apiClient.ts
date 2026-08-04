import { authStorage } from "@/api/auth/auth.storage";
import { API_BASE_URL } from "@/constants/api.constant";

type ApiClientOptions = {
  baseUrl?: string;
};

export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiQueryValue>;

export type ApiClientRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  params?: ApiQueryParams;
};

function resolveApiUrl(path: string, baseUrl = API_BASE_URL) {
  if (baseUrl) {
    return new URL(path, baseUrl).toString();
  }

  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).toString();
  }

  return path;
}

function appendQueryParams(url: URL, params?: ApiQueryParams) {
  if (!params) {
    return;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

export class ApiClient {
  private readonly baseUrl?: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl;
  }

  resolveUrl(path: string) {
    return resolveApiUrl(path, this.baseUrl);
  }

  async request<TResponse>(path: string, init?: ApiClientRequestOptions) {
    const url = new URL(this.resolveUrl(path));
    appendQueryParams(url, init?.params);
    const authToken = authStorage.getToken();
    const isJsonBody =
      init?.body &&
      typeof init.body === "object" &&
      !(init.body instanceof FormData) &&
      !(init.body instanceof Blob) &&
      !(init.body instanceof URLSearchParams) &&
      !(init.body instanceof ArrayBuffer);
    const requestBody: BodyInit | null | undefined = isJsonBody
      ? JSON.stringify(init.body)
      : (init?.body as BodyInit | null | undefined);

    const response = await fetch(url.toString(), {
      credentials: "include",
      ...init,
      headers: {
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        errorBody || `Request failed with status ${response.status}`,
      );
    }

    return (await response.json()) as TResponse;
  }

  async get<TResponse>(path: string, init?: ApiClientRequestOptions) {
    return this.request<TResponse>(path, {
      ...init,
      method: "GET",
    });
  }

  async post<TResponse>(
    path: string,
    body?: ApiClientRequestOptions["body"],
    init?: ApiClientRequestOptions,
  ) {
    return this.request<TResponse>(path, {
      ...init,
      method: "POST",
      body,
    });
  }
}

export const apiClient = new ApiClient();
