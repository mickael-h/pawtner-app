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

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  isLoading: false,
  errorMessage: null,
  isAuthenticated: false,
  hydrate: async () => {
    const session = await getSession();
    set({
      accessToken: session?.accessToken ?? null,
      refreshToken: session?.refreshToken ?? null,
      hydrated: true,
      isAuthenticated: Boolean(session?.accessToken),
    });
  },
  signIn: async () => {
    set({
      isLoading: true,
      errorMessage: null,
    });
    try {
      const session = await loginWithOidc();
      await saveSession(session);
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        errorMessage:
          error instanceof Error ? error.message : "Authentication failed.",
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
      errorMessage: null,
    });
    try {
      const session = await signUpWithOidc();
      await saveSession(session);
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        errorMessage:
          error instanceof Error ? error.message : "Registration failed.",
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
      isAuthenticated: false,
      errorMessage: null,
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
        isAuthenticated: true,
      });
      return true;
    } catch {
      await clearSession();
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    hydrated,
    isAuthenticated,
    isReady: hydrated && isAuthenticated,
  };
}
