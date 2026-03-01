import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppCard } from "../../shared/ui/components/AppCard";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTag } from "../../shared/ui/components/AppTag";
import { appTheme } from "../../shared/ui/theme";

export function EthicalCharterScreen() {
  const { t } = useTranslation();
  const commitments = [
    t("charter.commitmentOne"),
    t("charter.commitmentTwo"),
    t("charter.commitmentThree"),
    t("charter.commitmentFour"),
  ];

  return (
    <AppScreen>
      <View style={styles.container}>
        <AppTag label={t("charter.tag")} />
        <Text style={styles.title}>{t("charter.title")}</Text>
        <Text style={styles.intro}>{t("charter.intro")}</Text>

        {commitments.map((commitment) => (
          <AppCard key={commitment} style={styles.commitmentCard}>
            <Text style={styles.commitmentBullet}>•</Text>
            <Text style={styles.commitmentText}>{commitment}</Text>
          </AppCard>
        ))}
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
    fontSize: appTheme.typography.title,
    fontWeight: "800",
  },
  intro: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 24,
  },
  commitmentCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: appTheme.spacing.sm,
  },
  commitmentBullet: {
    color: appTheme.colors.primary,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 24,
  },
  commitmentText: {
    color: appTheme.colors.textPrimary,
    flex: 1,
    fontSize: appTheme.typography.body,
    lineHeight: 24,
  },
});
