import { StyleSheet, Text, View } from "react-native";

import { appTheme } from "../theme";

type AppTagProps = {
  label: string;
  tone?: "default" | "primary" | "warning";
};

export function AppTag({ label, tone = "default" }: AppTagProps) {
  return (
    <View style={[styles.container, tone === "primary" && styles.primary, tone === "warning" && styles.warning]}>
      <Text style={[styles.label, tone === "primary" && styles.primaryLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: 4,
  },
  primary: {
    backgroundColor: appTheme.colors.primary,
  },
  warning: {
    backgroundColor: "#fef3c7",
  },
  label: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#ffffff",
  },
});
