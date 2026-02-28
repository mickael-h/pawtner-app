import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuthStore } from "../src/store/authStore";

export default function OAuthRedirectScreen() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

