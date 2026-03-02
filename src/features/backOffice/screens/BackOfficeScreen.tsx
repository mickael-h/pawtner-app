import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  buildAnimalTypeDistribution,
  buildMonthlySalesPoints,
} from "../domain/chartData";
import { BackOfficeCharts } from "../ui/BackOfficeCharts";
import { getFemaleAnimals } from "../../shared/domain/selectors";
import { AnimalType } from "../../shared/domain/models";
import { mockAnimals } from "../../shared/data/mockData";
import { auditPriceEthics } from "../../shared/services/geminiService";
import { AppButton } from "../../shared/ui/components/AppButton";
import { AppCard } from "../../shared/ui/components/AppCard";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTag } from "../../shared/ui/components/AppTag";
import { AppTextField } from "../../shared/ui/components/AppTextField";
import { appTheme } from "../../shared/ui/theme";

type BackOfficeTab = "dashboard" | "females" | "males" | "audit";

export function BackOfficeScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<BackOfficeTab>("dashboard");
  const [auditType, setAuditType] = useState<AnimalType>(AnimalType.DOG);
  const [auditBreed, setAuditBreed] = useState("");
  const [auditPrice, setAuditPrice] = useState("");
  const [auditResult, setAuditResult] = useState("");
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const femaleAnimals = useMemo(() => getFemaleAnimals(mockAnimals), []);
  const maleAnimals = useMemo(
    () => mockAnimals.filter((animal) => animal.gender === "M"),
    [],
  );
  const monthlySalesPoints = useMemo(() => buildMonthlySalesPoints(), []);
  const animalDistribution = useMemo(
    () => buildAnimalTypeDistribution(mockAnimals),
    [],
  );

  async function runAudit() {
    const parsedPrice = Number(auditPrice);
    if (!auditBreed.trim() || Number.isNaN(parsedPrice)) {
      setAuditResult(t("backOffice.auditInvalidInput"));
      return;
    }

    setIsAuditLoading(true);
    try {
      const response = await auditPriceEthics(
        auditType,
        auditBreed,
        parsedPrice,
      );
      setAuditResult(response);
    } catch {
      setAuditResult(t("backOffice.auditUnavailable"));
    } finally {
      setIsAuditLoading(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.title}>{t("backOffice.title")}</Text>

        <View style={styles.tabRow}>
          <TabButton
            active={activeTab === "dashboard"}
            label={t("backOffice.tabDashboard")}
            onPress={() => setActiveTab("dashboard")}
          />
          <TabButton
            active={activeTab === "females"}
            label={t("backOffice.tabFemales")}
            onPress={() => setActiveTab("females")}
          />
          <TabButton
            active={activeTab === "males"}
            label={t("backOffice.tabMales")}
            onPress={() => setActiveTab("males")}
          />
          <TabButton
            active={activeTab === "audit"}
            label={t("backOffice.tabAudit")}
            onPress={() => setActiveTab("audit")}
          />
        </View>

        {activeTab === "dashboard" ? (
          <View style={styles.section}>
            <KpiCard
              label={t("backOffice.salesLabel")}
              value={t("backOffice.salesValue")}
              detail={t("backOffice.salesDetail")}
            />
            <KpiCard
              label={t("backOffice.littersLabel")}
              value={t("backOffice.littersValue")}
              detail={t("backOffice.littersDetail")}
            />
            <KpiCard
              label={t("backOffice.scoreLabel")}
              value={t("backOffice.scoreValue")}
              detail={t("backOffice.scoreDetail")}
            />
            <BackOfficeCharts
              distributionPoints={animalDistribution}
              salesPoints={monthlySalesPoints}
            />
          </View>
        ) : null}

        {activeTab === "females" ? (
          <View style={styles.section}>
            {femaleAnimals.map((animal) => (
              <AppCard key={animal.id} style={styles.animalRow}>
                <Image
                  source={{ uri: animal.imageUrl }}
                  style={styles.thumbnail}
                />
                <View style={styles.animalDetails}>
                  <Text style={styles.animalName}>{animal.name}</Text>
                  <Text style={styles.animalSub}>{animal.breed}</Text>
                  <AppTag label={animal.cycleStatus ?? t("backOffice.cycleUnknown")} />
                </View>
              </AppCard>
            ))}
          </View>
        ) : null}

        {activeTab === "males" ? (
          <View style={styles.section}>
            {maleAnimals.map((animal) => (
              <AppCard key={animal.id} style={styles.animalRow}>
                <Image
                  source={{ uri: animal.imageUrl }}
                  style={styles.thumbnail}
                />
                <View style={styles.animalDetails}>
                  <Text style={styles.animalName}>{animal.name}</Text>
                  <Text style={styles.animalSub}>{animal.breed}</Text>
                  <AppTag
                    label={
                      animal.isAvailableForClub
                        ? t("backOffice.studAvailable")
                        : t("backOffice.studStandard")
                    }
                  />
                </View>
              </AppCard>
            ))}
          </View>
        ) : null}

        {activeTab === "audit" ? (
          <View style={styles.section}>
            <AppCard style={styles.auditCard}>
              <Text style={styles.auditTitle}>{t("backOffice.auditTitle")}</Text>
              <View style={styles.typeSelector}>
                {[AnimalType.DOG, AnimalType.CAT, AnimalType.HORSE].map(
                  (type) => (
                    <Pressable
                      key={type}
                      onPress={() => setAuditType(type)}
                      style={({ pressed }) => [
                        styles.typeButton,
                        auditType === type && styles.typeButtonActive,
                        pressed && styles.interactivePressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeButtonLabel,
                          auditType === type && styles.typeButtonLabelActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
              <AppTextField
                label={t("backOffice.breedLabel")}
                onChangeText={setAuditBreed}
                placeholder={t("backOffice.breedPlaceholder")}
                value={auditBreed}
              />
              <AppTextField
                keyboardType="numeric"
                label={t("backOffice.priceLabel")}
                onChangeText={setAuditPrice}
                placeholder={t("backOffice.pricePlaceholder")}
                value={auditPrice}
              />
              <AppButton
                label={t("backOffice.launchAudit")}
                loading={isAuditLoading}
                onPress={() => void runAudit()}
              />
            </AppCard>

            {auditResult ? (
              <AppCard>
                <Text style={styles.noteText}>{auditResult}</Text>
              </AppCard>
            ) : null}
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ label, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        active && styles.tabButtonActive,
        pressed && styles.interactivePressed,
      ]}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  detail: string;
};

function KpiCard({ label, value, detail }: KpiCardProps) {
  return (
    <AppCard style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiDetail}>{detail}</Text>
    </AppCard>
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
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: appTheme.spacing.xs,
  },
  tabButton: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: appTheme.colors.primary,
  },
  tabLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  section: {
    gap: appTheme.spacing.sm,
  },
  kpiCard: {
    gap: 4,
  },
  kpiLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  kpiValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  kpiDetail: {
    color: appTheme.colors.primaryDark,
    fontSize: appTheme.typography.caption,
  },
  noteText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 22,
  },
  animalRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: appTheme.spacing.sm,
  },
  thumbnail: {
    borderRadius: appTheme.radius.md,
    height: 72,
    width: 72,
  },
  animalDetails: {
    flex: 1,
    gap: 4,
  },
  animalName: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  animalSub: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
  },
  auditCard: {
    gap: appTheme.spacing.sm,
  },
  auditTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "800",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: appTheme.spacing.xs,
  },
  typeButton: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: 8,
  },
  typeButtonActive: {
    backgroundColor: appTheme.colors.primary,
  },
  typeButtonLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  typeButtonLabelActive: {
    color: "#ffffff",
  },
  interactivePressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
});
