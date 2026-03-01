import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { appTheme } from "../theme";

type AppCardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.colors.surface,
    borderColor: appTheme.colors.border,
    borderRadius: appTheme.radius.lg,
    borderWidth: 1,
    padding: appTheme.spacing.md,
  },
});
