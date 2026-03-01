import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { appTheme } from "../theme";

type AppScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
}>;

export function AppScreen({
  children,
  scrollable = true,
  contentContainerStyle,
}: AppScreenProps) {
  if (!scrollable) {
    return <View style={[styles.container, contentContainerStyle]}>{children}</View>;
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.colors.background,
    flexGrow: 1,
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.lg,
  },
});
