const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function resolveApiUrl(path: string) {
  if (API_BASE_URL) {
    return new URL(path, API_BASE_URL).toString();
  }

  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).toString();
  }

  return path;
}

export async function requestJson<TResponse>(path: string, init?: RequestInit) {
  const response = await fetch(resolveApiUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export function resolveApiUrlPath(path: string) {
  return resolveApiUrl(path);
}
