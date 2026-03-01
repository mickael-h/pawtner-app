import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuthStore } from "../src/store/authStore";

export default function IndexScreen() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(public)" />;
}
