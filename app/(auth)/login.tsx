import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { env } from "../../src/config/env";
import { useAuthStore } from "../../src/store/authStore";

export default function LoginScreen() {
  const { t } = useTranslation();
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const signIn = useAuthStore((state) => state.signIn);

  const issuerHost = useMemo(() => {
    return new URL(env.keycloakIssuer).host;
  }, []);

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.loginTitle")}</Text>
      <Text style={styles.description}>{t("auth.loginDescription")}</Text>
      <Text style={styles.meta}>{t("auth.issuer", { issuer: issuerHost })}</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={isLoading}
        onPress={() => {
          void signIn();
        }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonLabel}>{t("auth.loginAction")}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: "#4b5563",
    fontSize: 16,
    textAlign: "center",
  },
  meta: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },
  error: {
    color: "#b91c1c",
    fontSize: 13,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 10,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
