import { env } from "../config/env";
import { useAuthStore } from "../store/authStore";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const buildHeaders = (token: string | null) => {
    const baseHeaders = new Headers(init?.headers);
    baseHeaders.set("Content-Type", "application/json");

    if (token) {
      baseHeaders.set("Authorization", `Bearer ${token}`);
    }

    return baseHeaders;
  };

  const runRequest = async (token: string | null) => {
    return fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: buildHeaders(token),
    });
  };

  let response = await runRequest(useAuthStore.getState().accessToken);

  if (response.status === 401) {
    const refreshed = await useAuthStore.getState().refreshSession();
    if (refreshed) {
      response = await runRequest(useAuthStore.getState().accessToken);
    }
  }

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(
      body || `API request failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as TResponse;
}
