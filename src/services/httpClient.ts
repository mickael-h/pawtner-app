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

function truncateForLog(value: string, maxLength = 4000): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

export async function apiFetch<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const method = init?.method ?? "GET";
  const requestUrl = `${env.apiBaseUrl}${path}`;

  const buildHeaders = (token: string | null) => {
    const baseHeaders = new Headers(init?.headers);
    baseHeaders.set("Content-Type", "application/json");

    if (token) {
      baseHeaders.set("Authorization", `Bearer ${token}`);
    }

    return baseHeaders;
  };

  const runRequest = async (token: string | null) => {
    try {
      console.info(`[api] -> ${method} ${requestUrl}`);
      return await fetch(requestUrl, {
        ...init,
        headers: buildHeaders(token),
      });
    } catch (error) {
      console.error(`[api] xx ${method} ${requestUrl} network error`, error);
      throw error;
    }
  };

  let response = await runRequest(useAuthStore.getState().accessToken);

  if (response.status === 401) {
    console.warn(`[api] !! ${method} ${requestUrl} returned 401, trying refresh`);
    const refreshed = await useAuthStore.getState().refreshSession();
    if (refreshed) {
      response = await runRequest(useAuthStore.getState().accessToken);
    } else {
      console.warn(
        `[api] !! ${method} ${requestUrl} refresh failed, keeping 401 response`,
      );
    }
  }

  const bodyText = await response.text();
  console.info(
    `[api] <- ${method} ${requestUrl} ${response.status} ${response.statusText} body=${truncateForLog(
      bodyText || "<empty>",
    )}`,
  );

  if (!response.ok) {
    throw new ApiError(
      bodyText || `API request failed with status ${response.status}`,
      response.status,
    );
  }

  if (!bodyText) {
    return undefined as TResponse;
  }

  return JSON.parse(bodyText) as TResponse;
}
