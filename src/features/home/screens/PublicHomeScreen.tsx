import { Link } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { familyImageUrl, heroImageUrl } from "../../shared/data/mockData";
import { AppCard } from "../../shared/ui/components/AppCard";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTag } from "../../shared/ui/components/AppTag";
import { appTheme } from "../../shared/ui/theme";

export function PublicHomeScreen() {
  const { t } = useTranslation();
  const [isFamilyImageUnavailable, setIsFamilyImageUnavailable] = useState(false);

  return (
    <AppScreen>
      <ImageBackground source={{ uri: heroImageUrl }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <AppTag label={t("publicHome.heroTag")} tone="primary" />
          <Text style={styles.heroTitle}>
            {t("publicHome.heroTitlePrefix")}
            {"\n"}
            <Text style={styles.heroTitleAccent}>{t("publicHome.heroTitleAccent")}</Text>
          </Text>
          <Text style={styles.heroSubtitle}>{t("publicHome.heroSubtitle")}</Text>
          <View style={styles.heroActions}>
            <Link asChild href="/(auth)/login">
              <Pressable style={styles.primaryActionButton}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  numberOfLines={1}
                  style={styles.primaryActionLabel}
                >
                  {t("publicHome.heroPrimaryAction")}
                </Text>
              </Pressable>
            </Link>
            <Link asChild href="/(public)/ethical-charter">
              <Pressable style={styles.secondaryActionButton}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  numberOfLines={1}
                  style={styles.secondaryActionLabel}
                >
                  {t("publicHome.heroSecondaryAction")}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ImageBackground>

      <AppCard style={styles.familyCard}>
        {isFamilyImageUnavailable ? (
          <View style={[styles.familyImage, styles.familyImageFallback]}>
            <Text style={styles.familyImageFallbackText}>
              {t("publicHome.familyImageFallback")}
            </Text>
          </View>
        ) : (
          <Image
            onError={() => setIsFamilyImageUnavailable(true)}
            source={{ uri: familyImageUrl }}
            style={styles.familyImage}
          />
        )}
        <AppTag label={t("publicHome.familyTag")} tone="warning" />
        <Text style={styles.sectionTitle}>{t("publicHome.familyTitle")}</Text>
        <Text style={styles.sectionText}>{t("publicHome.familyDescription")}</Text>
      </AppCard>

      <View style={styles.valuesGrid}>
        <AppCard style={styles.valueCard}>
          <Text style={styles.valueTitle}>{t("publicHome.valueOneTitle")}</Text>
          <Text style={styles.valueText}>{t("publicHome.valueOneDescription")}</Text>
        </AppCard>
        <AppCard style={styles.valueCard}>
          <Text style={styles.valueTitle}>{t("publicHome.valueTwoTitle")}</Text>
          <Text style={styles.valueText}>{t("publicHome.valueTwoDescription")}</Text>
        </AppCard>
        <AppCard style={styles.valueCard}>
          <Text style={styles.valueTitle}>{t("publicHome.valueThreeTitle")}</Text>
          <Text style={styles.valueText}>{t("publicHome.valueThreeDescription")}</Text>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: appTheme.radius.xl,
    marginBottom: appTheme.spacing.lg,
    minHeight: 420,
    overflow: "hidden",
  },
  heroImage: {
    borderRadius: appTheme.radius.xl,
  },
  heroOverlay: {
    backgroundColor: "rgba(2, 6, 23, 0.55)",
    flex: 1,
    gap: appTheme.spacing.md,
    justifyContent: "flex-end",
    padding: appTheme.spacing.lg,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 48,
  },
  heroTitleAccent: {
    color: appTheme.colors.primary,
  },
  heroSubtitle: {
    color: "#e2e8f0",
    fontSize: appTheme.typography.body,
    lineHeight: 24,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: appTheme.spacing.sm,
    width: "100%",
  },
  primaryActionButton: {
    alignItems: "center",
    backgroundColor: appTheme.colors.primary,
    borderRadius: 999,
    elevation: 3,
    flex: 1,
    minHeight: 54,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: appTheme.spacing.sm,
    shadowColor: appTheme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  primaryActionLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryActionButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: appTheme.colors.border,
    borderWidth: 1,
    borderRadius: 999,
    flex: 1,
    minHeight: 54,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: appTheme.spacing.sm,
  },
  secondaryActionLabel: {
    color: appTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  familyImageFallback: {
    alignItems: "center",
    backgroundColor: appTheme.colors.accent,
    justifyContent: "center",
    paddingHorizontal: appTheme.spacing.lg,
  },
  familyImageFallbackText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    textAlign: "center",
  },
  familyCard: {
    gap: appTheme.spacing.md,
    marginBottom: appTheme.spacing.lg,
  },
  familyImage: {
    borderRadius: appTheme.radius.lg,
    height: 220,
    width: "100%",
  },
  sectionTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.section,
    fontWeight: "800",
  },
  sectionText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 24,
  },
  valuesGrid: {
    gap: appTheme.spacing.md,
  },
  valueCard: {
    gap: appTheme.spacing.sm,
  },
  valueTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  valueText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 22,
  },
});
