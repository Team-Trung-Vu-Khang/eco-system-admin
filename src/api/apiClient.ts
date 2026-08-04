import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api.constant";
import { attachApiRequestMiddleware } from "./middlewares/request.middleware";
import { attachApiResponseMiddleware } from "./middlewares/response.middleware";

export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiQueryValue>;

export type ApiClientRequestOptions = Omit<
  AxiosRequestConfig,
  "baseURL" | "url" | "data" | "params" | "headers" | "method"
> & {
  body?: AxiosRequestConfig["data"];
  params?: ApiQueryParams;
  headers?: AxiosRequestConfig["headers"];
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

attachApiRequestMiddleware(client);
attachApiResponseMiddleware(client);

function toAxiosHeaders(
  headers: AxiosRequestConfig["headers"] | undefined,
): AxiosHeaders {
  return AxiosHeaders.from(headers as any);
}

async function request<TResponse>(
  path: string,
  init: (ApiClientRequestOptions & { method?: AxiosRequestConfig["method"] }) =
    {},
) {
  const response = await client.request<TResponse>({
    url: path,
    method: init.method ?? "GET",
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

export const apiClient = {
  request,
  get<TResponse>(path: string, init?: ApiClientRequestOptions) {
    return request<TResponse>(path, { ...init, method: "GET" });
  },
  post<TResponse>(
    path: string,
    body?: ApiClientRequestOptions["body"],
    init?: ApiClientRequestOptions,
  ) {
    return request<TResponse>(path, { ...init, method: "POST", body });
  },
  put<TResponse>(
    path: string,
    body?: ApiClientRequestOptions["body"],
    init?: ApiClientRequestOptions,
  ) {
    return request<TResponse>(path, { ...init, method: "PUT", body });
  },
};
