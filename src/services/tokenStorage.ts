import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "pawtner.accessToken";
const REFRESH_TOKEN_KEY = "pawtner.refreshToken";
const ID_TOKEN_KEY = "pawtner.idToken";

export type StoredSession = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
};

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getSession(): Promise<StoredSession | null> {
  const [accessToken, refreshToken, idToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(ID_TOKEN_KEY),
  ]);

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    idToken,
  };
}

export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function saveSession(session: StoredSession) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
    session.refreshToken
      ? SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken)
      : SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    session.idToken
      ? SecureStore.setItemAsync(ID_TOKEN_KEY, session.idToken)
      : SecureStore.deleteItemAsync(ID_TOKEN_KEY),
  ]);
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(ID_TOKEN_KEY),
  ]);
}
