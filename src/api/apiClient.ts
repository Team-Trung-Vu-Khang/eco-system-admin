import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/constants/api.constant";
import { attachApiRequestMiddleware } from "./middlewares/request.middleware";
import { attachApiResponseMiddleware } from "./middlewares/response.middleware";

type ApiClientOptions = {
  baseUrl?: string;
};

export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiQueryValue>;

export type ApiClientRequestOptions = Omit<
  AxiosRequestConfig,
  "baseURL" | "url" | "data" | "params" | "headers"
> & {
  body?: AxiosRequestConfig["data"];
  params?: ApiQueryParams;
  headers?: AxiosRequestConfig["headers"];
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

function toAxiosHeaders(
  headers: AxiosRequestConfig["headers"] | undefined,
): AxiosHeaders {
  return AxiosHeaders.from(headers as any);
}

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(options: ApiClientOptions = {}) {
    this.client = axios.create({
      baseURL: options.baseUrl ?? API_BASE_URL,
      timeout: 30_000,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    attachApiRequestMiddleware(this.client);
    attachApiResponseMiddleware(this.client);
  }

  resolveUrl(path: string) {
    return resolveApiUrl(path, this.client.defaults.baseURL);
  }

  async request<TResponse>(path: string, init: ApiClientRequestOptions = {}) {
    const response = await this.client.request<TResponse>({
      url: path,
      method: init.method,
      params: init.params,
      data: init.body,
      headers: toAxiosHeaders(init.headers),
      signal: init.signal,
      timeout: init.timeout,
      withCredentials: init.withCredentials,
      responseType: init.responseType,
      maxBodyLength: init.maxBodyLength,
      maxContentLength: init.maxContentLength,
      onDownloadProgress: init.onDownloadProgress,
      onUploadProgress: init.onUploadProgress,
      validateStatus: init.validateStatus,
    });

    return response.data;
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

  async put<TResponse>(
    path: string,
    body?: ApiClientRequestOptions["body"],
    init?: ApiClientRequestOptions,
  ) {
    return this.request<TResponse>(path, {
      ...init,
      method: "PUT",
      body,
    });
  }
}

export const apiClient = new ApiClient();
