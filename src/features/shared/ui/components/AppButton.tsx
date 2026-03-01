import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { appTheme } from "../theme";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? "#ffffff" : appTheme.colors.textPrimary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: appTheme.radius.md,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: appTheme.spacing.md,
  },
  primaryButton: {
    backgroundColor: appTheme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: appTheme.colors.surface,
    borderColor: appTheme.colors.border,
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#ffffff",
  },
  secondaryLabel: {
    color: appTheme.colors.textPrimary,
  },
});
