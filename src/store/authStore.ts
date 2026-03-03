import { useEffect } from "react";
import { create } from "zustand";

import {
  clearSession,
  getSession,
  saveSession,
} from "../services/tokenStorage";
import {
  endKeycloakSession,
  loginWithOidc,
  refreshWithOidc,
  signUpWithOidc,
} from "../services/auth/oidcClient";
import { extractErrorDetail } from "../services/errorFeedback";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  isLoading: boolean;
  errorCode: AuthErrorCode | null;
  errorDetail: string | null;
  hydrate: () => Promise<void>;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

export type AuthErrorCode = "cancelled" | "network" | "oidcUnavailable" | "unknown";

function normalizeAuthError(error: unknown): AuthErrorCode {
  if (!(error instanceof Error)) {
    return "unknown";
  }

  const message = error.message.toLowerCase();

  if (/(cancel|canceled|cancelled|dismiss)/.test(message)) {
    return "cancelled";
  }

  if (/(network|timeout|timed out|internet|econn|enotfound)/.test(message)) {
    return "network";
  }

  if (/(oidc|issuer|authorization|authorize|token|keycloak)/.test(message)) {
    return "oidcUnavailable";
  }

  return "unknown";
}

export const selectIsAuthenticated = (state: Pick<AuthState, "accessToken">) =>
  Boolean(state.accessToken);

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  isLoading: false,
  errorCode: null,
  errorDetail: null,
  hydrate: async () => {
    const session = await getSession();
    set({
      accessToken: session?.accessToken ?? null,
      refreshToken: session?.refreshToken ?? null,
      hydrated: true,
    });
  },
  signIn: async () => {
    set({
      isLoading: true,
      errorCode: null,
      errorDetail: null,
    });
    try {
      const session = await loginWithOidc();
      await saveSession(session);
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
    } catch (error) {
      set({
        errorCode: normalizeAuthError(error),
        errorDetail: extractErrorDetail(error),
      });
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  signUp: async () => {
    set({
      isLoading: true,
      errorCode: null,
      errorDetail: null,
    });
    try {
      const session = await signUpWithOidc();
      await saveSession(session);
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
    } catch (error) {
      set({
        errorCode: normalizeAuthError(error),
        errorDetail: extractErrorDetail(error),
      });
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  signOut: async () => {
    const session = await getSession();
    await clearSession();
    set({
      accessToken: null,
      refreshToken: null,
      errorCode: null,
      errorDetail: null,
    });
    // End Keycloak session in same browser context as sign-in so next sign-in shows login form.
    if (session?.idToken) {
      endKeycloakSession(session.idToken).catch(() => {});
    }
  },
  refreshSession: async () => {
    const currentRefreshToken = useAuthStore.getState().refreshToken;
    if (!currentRefreshToken) {
      return false;
    }

    try {
      const session = await refreshWithOidc(currentRefreshToken);
      await saveSession(session);
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      return true;
    } catch {
      await clearSession();
      set({
        accessToken: null,
        refreshToken: null,
      });
      return false;
    }
  },
}));

export function useAuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);
}

export function useRequireAuthReady() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return {
    hydrated,
    isAuthenticated,
    isReady: hydrated && isAuthenticated,
  };
}
