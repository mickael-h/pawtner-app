import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ChartPoint } from "../domain/chartData";
import { AppCard } from "../../shared/ui/components/AppCard";
import { appTheme } from "../../shared/ui/theme";

type BackOfficeChartsProps = {
  salesPoints: ChartPoint[];
  distributionPoints: ChartPoint[];
};

export function BackOfficeCharts({
  salesPoints,
  distributionPoints,
}: BackOfficeChartsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t("backOffice.chartsSectionTitle")}</Text>

      <AppCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t("backOffice.salesTrendTitle")}</Text>
        {salesPoints.length === 0 ? (
          <Text style={styles.noDataText}>{t("backOffice.noData")}</Text>
        ) : (
          <View style={styles.barsRow}>
            {salesPoints.map((point) => (
              <View key={point.label} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${Math.max(point.ratio * 100, 8)}%` }]} />
                </View>
                <Text style={styles.barLabel}>{point.label}</Text>
              </View>
            ))}
          </View>
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t("backOffice.populationByTypeTitle")}</Text>
        {distributionPoints.length === 0 ? (
          <Text style={styles.noDataText}>{t("backOffice.noData")}</Text>
        ) : (
          <View style={styles.horizontalBars}>
            {distributionPoints.map((point) => (
              <View key={point.label} style={styles.horizontalRow}>
                <Text style={styles.horizontalLabel}>{point.label}</Text>
                <View style={styles.horizontalTrack}>
                  <View
                    style={[styles.horizontalFill, { width: `${Math.max(point.ratio * 100, 6)}%` }]}
                  />
                </View>
                <Text style={styles.horizontalValue}>{point.value}</Text>
              </View>
            ))}
          </View>
        )}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: appTheme.spacing.sm,
  },
  sectionTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "800",
  },
  chartCard: {
    gap: appTheme.spacing.sm,
  },
  chartTitle: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  noDataText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
  },
  barsRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: appTheme.spacing.sm,
    minHeight: 150,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  barTrack: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: appTheme.radius.md,
    height: 120,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  barFill: {
    backgroundColor: appTheme.colors.primary,
    borderRadius: appTheme.radius.md,
    minHeight: 6,
    width: "100%",
  },
  barLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  horizontalBars: {
    gap: appTheme.spacing.xs,
  },
  horizontalRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: appTheme.spacing.sm,
  },
  horizontalLabel: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
    width: 54,
  },
  horizontalTrack: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: appTheme.radius.sm,
    flex: 1,
    height: 12,
    overflow: "hidden",
  },
  horizontalFill: {
    backgroundColor: appTheme.colors.primaryDark,
    borderRadius: appTheme.radius.sm,
    height: "100%",
    minWidth: 6,
  },
  horizontalValue: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
    textAlign: "right",
    width: 18,
  },
});
