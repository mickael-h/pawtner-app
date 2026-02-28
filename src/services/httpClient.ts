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
  const token = useAuthStore.getState().accessToken;
  const baseHeaders = new Headers(init?.headers);
  baseHeaders.set("Content-Type", "application/json");

  if (token) {
    baseHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: baseHeaders,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(
      body || `API request failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as TResponse;
}
