import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppCard } from "../../shared/ui/components/AppCard";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTag } from "../../shared/ui/components/AppTag";
import { appTheme } from "../../shared/ui/theme";

type AuthScaffoldProps = PropsWithChildren<{
  title: string;
  description: string;
  errorMessage: string | null;
  footerHint: string;
  footerActionLabel: string;
  onFooterActionPress?: () => void;
  isFooterActionDisabled?: boolean;
}>;

export function AuthScaffold({
  children,
  title,
  description,
  errorMessage,
  footerHint,
  footerActionLabel,
  onFooterActionPress,
  isFooterActionDisabled = false,
}: AuthScaffoldProps) {
  const { t } = useTranslation();

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppTag label={t("auth.pawtnerId")} tone="primary" />
        <Text style={styles.welcomeTitle}>{title}</Text>
        <Text style={styles.welcomeSubtitle}>{description}</Text>
      </View>

      <AppCard style={styles.card}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.formContent}>{children}</View>
      </AppCard>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>{footerHint}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={isFooterActionDisabled}
          onPress={onFooterActionPress}
          style={({ pressed }) => [
            styles.footerActionPressable,
            pressed && styles.footerActionPressed,
            isFooterActionDisabled && styles.footerActionDisabled,
          ]}
        >
          <Text style={styles.footerAction}>{footerActionLabel}</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: appTheme.spacing.lg,
    justifyContent: "center",
  },
  header: {
    gap: appTheme.spacing.sm,
  },
  welcomeTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.title,
    fontWeight: "800",
  },
  welcomeSubtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 24,
  },
  card: {
    gap: appTheme.spacing.sm,
  },
  errorText: {
    color: appTheme.colors.danger,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  formContent: {
    gap: appTheme.spacing.sm,
    marginTop: appTheme.spacing.xs,
  },
  footer: {
    alignItems: "center",
    gap: appTheme.spacing.xs,
  },
  footerHint: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
  },
  footerAction: {
    color: appTheme.colors.primaryDark,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  footerActionPressable: {
    borderRadius: appTheme.radius.sm,
    paddingHorizontal: appTheme.spacing.xs,
    paddingVertical: 2,
  },
  footerActionPressed: {
    opacity: 0.85,
  },
  footerActionDisabled: {
    opacity: 0.55,
  },
});
