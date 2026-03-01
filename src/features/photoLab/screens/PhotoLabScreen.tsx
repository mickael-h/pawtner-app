import { useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import { editAnimalPhoto } from "../../shared/services/geminiService";
import { AppButton } from "../../shared/ui/components/AppButton";
import { AppCard } from "../../shared/ui/components/AppCard";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTextField } from "../../shared/ui/components/AppTextField";
import { appTheme } from "../../shared/ui/theme";

export function PhotoLabScreen() {
  const { t } = useTranslation();
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [editedImageUri, setEditedImageUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(t("photoLab.defaultPrompt"));
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canProcess = useMemo(() => {
    return sourceImageBase64 !== null && prompt.trim().length > 0;
  }, [prompt, sourceImageBase64]);

  async function pickImage() {
    setErrorMessage(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMessage(t("photoLab.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];
    const selectedBase64 = selectedAsset.base64 ?? null;
    if (!selectedBase64) {
      setErrorMessage(t("photoLab.imageReadFailed"));
      return;
    }

    if (selectedBase64.length > 6_500_000) {
      setErrorMessage(t("photoLab.imageTooLarge"));
      return;
    }

    setSourceImageBase64(selectedBase64);
    setEditedImageUri(null);
  }

  async function processImage() {
    if (!sourceImageBase64) {
      setErrorMessage(t("photoLab.selectImageFirst"));
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await editAnimalPhoto(sourceImageBase64, prompt);
      setEditedImageUri(result);
    } catch {
      setErrorMessage(t("photoLab.processingFailed"));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.title}>{t("photoLab.title")}</Text>
        <Text style={styles.subtitle}>{t("photoLab.subtitle")}</Text>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>{t("photoLab.originalImageTitle")}</Text>
          {sourceImageBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${sourceImageBase64}` }}
              style={styles.preview}
            />
          ) : (
            <View style={[styles.preview, styles.emptyPreview]}>
              <Text style={styles.emptyPreviewText}>{t("photoLab.noImageSelected")}</Text>
            </View>
          )}
          <AppButton
            label={t("photoLab.pickImage")}
            onPress={() => void pickImage()}
            variant="secondary"
          />
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>{t("photoLab.instructionsTitle")}</Text>
          <AppTextField
            label={t("photoLab.promptLabel")}
            multiline
            onChangeText={setPrompt}
            placeholder={t("photoLab.promptPlaceholder")}
            value={prompt}
          />
          <AppButton
            disabled={!canProcess}
            label={t("photoLab.launchMagic")}
            loading={isProcessing}
            onPress={() => void processImage()}
          />
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>{t("photoLab.resultTitle")}</Text>
          {editedImageUri ? (
            <Image source={{ uri: editedImageUri }} style={styles.preview} />
          ) : (
            <View style={[styles.preview, styles.emptyPreview]}>
              <Text style={styles.emptyPreviewText}>{t("photoLab.resultPlaceholder")}</Text>
            </View>
          )}
        </AppCard>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
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
    fontSize: appTheme.typography.section,
    fontWeight: "800",
  },
  subtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
  },
  section: {
    gap: appTheme.spacing.sm,
  },
  sectionTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  preview: {
    borderRadius: appTheme.radius.md,
    height: 260,
    width: "100%",
  },
  emptyPreview: {
    alignItems: "center",
    backgroundColor: appTheme.colors.accent,
    justifyContent: "center",
    padding: appTheme.spacing.md,
  },
  emptyPreviewText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    textAlign: "center",
  },
  errorMessage: {
    color: appTheme.colors.danger,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
});
