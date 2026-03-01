function readEnv(name: string) {
  return process.env[name]?.trim();
}

function readUrlEnv(name: string, fallback: string) {
  const rawValue = readEnv(name) ?? fallback;
  const url = new URL(rawValue);
  return url.toString().replace(/\/$/, "");
}

export const env = {
  apiBaseUrl: readUrlEnv("EXPO_PUBLIC_API_BASE_URL", "http://localhost:3000"),
  keycloakIssuer: readUrlEnv(
    "EXPO_PUBLIC_KEYCLOAK_ISSUER",
    "http://localhost:18080/realms/pawtner",
  ),
  keycloakClientId:
    readEnv("EXPO_PUBLIC_KEYCLOAK_CLIENT_ID") ?? "pawtner-mobile",
  keycloakRedirectUrl:
    readEnv("EXPO_PUBLIC_KEYCLOAK_REDIRECT_URL") ??
    "com.pawtner.oauth://oauthredirect",
  allowInsecureHttp:
    (readEnv("EXPO_PUBLIC_ALLOW_INSECURE_HTTP") ?? "false") === "true",
  geminiApiKey: readEnv("EXPO_PUBLIC_GEMINI_API_KEY") ?? "",
} as const;
