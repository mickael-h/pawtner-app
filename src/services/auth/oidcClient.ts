import {
  authorize,
  logout,
  refresh,
  type AuthConfiguration,
} from "react-native-app-auth";

import { env } from "../../config/env";

export type AuthSession = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
};

const authConfig: AuthConfiguration = {
  clientId: env.keycloakClientId,
  issuer: env.keycloakIssuer,
  redirectUrl: env.keycloakRedirectUrl,
  scopes: ["openid", "profile", "email", "offline_access"],
  dangerouslyAllowInsecureHttpRequests: env.allowInsecureHttp,
};

export async function loginWithOidc(): Promise<AuthSession> {
  const result = await authorize(authConfig);

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken ?? null,
    idToken: result.idToken ?? null,
  };
}

export async function signUpWithOidc(): Promise<AuthSession> {
  const result = await authorize({
    ...authConfig,
    additionalParameters: {
      ...authConfig.additionalParameters,
      // `prompt=create` works reliably on recent Keycloak versions.
      // `kc_action=register` preserves compatibility with existing realm behavior.
      prompt: "create",
      kc_action: "register",
    } as unknown as AuthConfiguration["additionalParameters"],
  });

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken ?? null,
    idToken: result.idToken ?? null,
  };
}

export async function refreshWithOidc(
  refreshToken: string,
): Promise<AuthSession> {
  const result = await refresh(authConfig, {
    refreshToken,
  });

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken ?? refreshToken,
    idToken: result.idToken ?? null,
  };
}

/**
 * End Keycloak session in the same browser context used for sign-in,
 * so the next sign-in shows the login form. Uses the OAuth redirect URI
 * as post-logout redirect so Keycloak accepts it (add it to Valid Post
 * Logout Redirect URIs or set that field to "+" to inherit).
 */
export async function endKeycloakSession(idToken: string): Promise<void> {
  await logout(
    {
      clientId: env.keycloakClientId,
      issuer: env.keycloakIssuer,
      dangerouslyAllowInsecureHttpRequests: env.allowInsecureHttp,
    },
    {
      idToken,
      postLogoutRedirectUrl: env.keycloakRedirectUrl,
    },
  );
}
