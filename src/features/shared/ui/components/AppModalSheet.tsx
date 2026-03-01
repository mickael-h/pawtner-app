import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { appTheme } from "../theme";

type AppModalSheetProps = PropsWithChildren<{
  visible: boolean;
  onRequestClose: () => void;
}>;

export function AppModalSheet({
  children,
  visible,
  onRequestClose,
}: AppModalSheetProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <Pressable onPress={onRequestClose} style={styles.overlay}>
        <Pressable style={styles.sheet}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    flex: 1,
    justifyContent: "flex-end",
    padding: appTheme.spacing.md,
  },
  sheet: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    maxHeight: "85%",
    padding: appTheme.spacing.md,
  },
});
