import { Pressable, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../src/store/authStore";

export default function HomeScreen() {
  const { t } = useTranslation();
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signOut = useAuthStore((state) => state.signOut);

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
      <Text style={styles.status}>{t("auth.connected")}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void signOut();
        }}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>{t("auth.logoutAction")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#374151",
    fontSize: 16,
    textAlign: "center",
  },
  status: {
    color: "#059669",
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 8,
    minWidth: 180,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
