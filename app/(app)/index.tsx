import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppButton } from "../../src/features/shared/ui/components/AppButton";
import { AppCard } from "../../src/features/shared/ui/components/AppCard";
import { AppScreen } from "../../src/features/shared/ui/components/AppScreen";
import { appTheme } from "../../src/features/shared/ui/theme";
import { useAuthStore } from "../../src/store/authStore";

export default function HomeScreen() {
  const { t } = useTranslation();
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <AppScreen>
      <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
      <Text style={styles.status}>{t("auth.connected")}</Text>
      <AppCard style={styles.linksCard}>
        <Link href="/(app)/marketplace" style={styles.link}>
          {t("home.marketplaceLink")}
        </Link>
        <Link href="/(app)/back-office" style={styles.link}>
          {t("home.backOfficeLink")}
        </Link>
        <Link href="/(app)/photo-lab" style={styles.link}>
          {t("home.photoLabLink")}
        </Link>
      </AppCard>
      <AppButton
        label={t("auth.logoutAction")}
        onPress={() => {
          void signOut();
        }}
        variant="secondary"
      />
      {!hydrated || !isAuthenticated ? (
        <Text style={styles.statusWarning}>{t("auth.notConnected")}</Text>
      ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: appTheme.spacing.md,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.section,
    fontWeight: "800",
  },
  subtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
  },
  status: {
    color: appTheme.colors.primaryDark,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  linksCard: {
    gap: appTheme.spacing.sm,
  },
  link: {
    color: appTheme.colors.primaryDark,
    fontSize: appTheme.typography.body,
    fontWeight: "600",
  },
  statusWarning: {
    color: appTheme.colors.warning,
    fontSize: appTheme.typography.caption,
  },
});
