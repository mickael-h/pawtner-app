import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../../store/authStore";
import { AppButton } from "../../shared/ui/components/AppButton";
import { appTheme } from "../../shared/ui/theme";
import { AuthScaffold } from "../components/AuthScaffold";

export function SignInScreen() {
  const { t } = useTranslation();
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);

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
    <AuthScaffold
      description={t("auth.loginDescription")}
      errorMessage={errorMessage}
      footerActionLabel={t("auth.signupAction")}
      footerHint={t("auth.noAccount")}
      isFooterActionDisabled={isLoading}
      onFooterActionPress={() => {
        void signUp();
      }}
      title={t("auth.loginTitle")}
    >
      <AppButton
        label={t("auth.loginAction")}
        loading={isLoading}
        onPress={() => {
          void signIn();
        }}
      />
      <Text style={styles.helperText}>{t("auth.welcomeSubtitle")}</Text>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    backgroundColor: appTheme.colors.background,
    flex: 1,
    justifyContent: "center",
  },
  helperText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    lineHeight: 20,
  },
});
