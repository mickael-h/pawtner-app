import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { formatPriceEur } from "../../shared/domain/formatters";
import {
  Animal,
  AnimalType,
  Breeder,
  ListingFilter,
  ListingType,
  SearchFilter
} from "../../shared/domain/models";
import {
  filterAnimals,
  getAverageRating
} from "../../shared/domain/selectors";
import {
  getBreederTrustSummary,
  getEthicalInsight,
} from "../../shared/services/geminiService";
import { formatErrorFeedback } from "../../../services/errorFeedback";
import {
  fetchMarketplaceAnimals,
  fetchMerchantBreeder,
  toApiAnimalType,
  toApiListingType,
} from "../../shared/services/marketplaceApi";
import { AppButton } from "../../shared/ui/components/AppButton";
import { AppCard } from "../../shared/ui/components/AppCard";
import { AppModalSheet } from "../../shared/ui/components/AppModalSheet";
import { AppScreen } from "../../shared/ui/components/AppScreen";
import { AppTag } from "../../shared/ui/components/AppTag";
import { AppTextField } from "../../shared/ui/components/AppTextField";
import { appTheme } from "../../shared/ui/theme";

type InsightState = {
  breed: string;
  text: string;
} | null;

export function MarketplaceScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<SearchFilter>("All");
  const [selectedListing, setSelectedListing] = useState<ListingFilter>("All");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataErrorMessage, setDataErrorMessage] = useState<string | null>(null);

  const [insightState, setInsightState] = useState<InsightState>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const [selectedBreeder, setSelectedBreeder] = useState<Breeder | null>(null);
  const [trustSummary, setTrustSummary] = useState("");
  const [isTrustLoading, setIsTrustLoading] = useState(false);

  const filteredAnimals = useMemo(() => {
    return filterAnimals({
      animals,
      searchQuery,
      selectedType,
      selectedListing,
    });
  }, [animals, searchQuery, selectedListing, selectedType]);

  useEffect(() => {
    async function loadMarketplaceOffers() {
      setIsDataLoading(true);
      setDataErrorMessage(null);
      try {
        const result = await fetchMarketplaceAnimals({
          animalType: toApiAnimalType(selectedType),
          listingType: toApiListingType(selectedListing),
          status: "published",
        });
        setAnimals(result);
      } catch (error) {
        setDataErrorMessage(formatErrorFeedback(t("marketplace.loadFailed"), error));
      } finally {
        setIsDataLoading(false);
      }
    }

    void loadMarketplaceOffers();
  }, [selectedListing, selectedType, t]);

  async function openInsight(animal: Animal) {
    setIsInsightLoading(true);
    setInsightState({
      breed: animal.breed,
      text: t("marketplace.insightLoading"),
    });

    try {
      const insight = await getEthicalInsight(animal.breed);
      setInsightState({
        breed: animal.breed,
        text: insight,
      });
    } catch (error) {
      setInsightState({
        breed: animal.breed,
        text: formatErrorFeedback(t("marketplace.insightUnavailable"), error),
      });
    } finally {
      setIsInsightLoading(false);
    }
  }

  async function openBreederDetails(breederId: string) {
    setSelectedBreeder(null);
    setTrustSummary("");
    setIsTrustLoading(true);

    try {
      const breeder = await fetchMerchantBreeder(breederId);
      setSelectedBreeder(breeder);
      const summary = await getBreederTrustSummary(breeder.name, breeder.reviews);
      setTrustSummary(summary);
    } catch (error) {
      setTrustSummary(formatErrorFeedback(t("marketplace.trustUnavailable"), error));
    } finally {
      setIsTrustLoading(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.title}>{t("marketplace.title")}</Text>
        <Text style={styles.subtitle}>{t("marketplace.subtitle")}</Text>

        <AppTextField
          label={t("marketplace.searchLabel")}
          onChangeText={setSearchQuery}
          placeholder={t("marketplace.searchPlaceholder")}
          value={searchQuery}
        />

        <FilterGroup<SearchFilter>
          options={[
            { label: t("marketplace.filterAll"), value: "All" },
            { label: AnimalType.DOG, value: AnimalType.DOG },
            { label: AnimalType.CAT, value: AnimalType.CAT },
            { label: AnimalType.HORSE, value: AnimalType.HORSE },
          ]}
          onSelect={setSelectedType}
          selected={selectedType}
        />

        <FilterGroup<ListingFilter>
          options={[
            { label: t("marketplace.filterAll"), value: "All" },
            { label: ListingType.SALE, value: ListingType.SALE },
            { label: ListingType.STUD, value: ListingType.STUD },
          ]}
          onSelect={setSelectedListing}
          selected={selectedListing}
        />

        {isDataLoading ? (
          <AppCard>
            <Text style={styles.emptyText}>{t("marketplace.loadingOffers")}</Text>
          </AppCard>
        ) : null}

        {dataErrorMessage ? (
          <AppCard>
            <Text style={styles.emptyTitle}>{t("marketplace.emptyTitle")}</Text>
            <Text style={styles.emptyText}>{dataErrorMessage}</Text>
          </AppCard>
        ) : null}

        {!isDataLoading && !dataErrorMessage && filteredAnimals.length === 0 ? (
          <AppCard>
            <Text style={styles.emptyTitle}>{t("marketplace.emptyTitle")}</Text>
            <Text style={styles.emptyText}>{t("marketplace.emptyText")}</Text>
          </AppCard>
        ) : (
          filteredAnimals.map((animal) => {
            const breederTitle = t("marketplace.breederFallbackName", {
              code: animal.breederId.slice(0, 8),
            });
            return (
              <AppCard key={animal.id} style={styles.animalCard}>
                <Image source={{ uri: animal.imageUrl }} style={styles.animalImage} />
                <View style={styles.animalHeader}>
                  <View style={styles.animalTitleBlock}>
                    <Text style={styles.animalName}>{animal.name}</Text>
                    <Text style={styles.animalBreed}>{animal.breed}</Text>
                  </View>
                  <Text style={styles.price}>{formatPriceEur(animal.price)}</Text>
                </View>

                <AppTag
                  label={animal.listingType}
                  tone={animal.listingType === ListingType.SALE ? "primary" : "warning"}
                />

                <Text style={styles.description}>{animal.description}</Text>

                <Pressable
                  onPress={() => {
                    void openBreederDetails(animal.breederId);
                  }}
                  style={({ pressed }) => [
                    styles.breederButton,
                    pressed && styles.interactivePressed,
                  ]}
                >
                  <Text style={styles.breederName}>{breederTitle}</Text>
                  <Text style={styles.breederMeta}>{t("marketplace.breederHint")}</Text>
                </Pressable>

                <AppButton
                  label={t("marketplace.insightButton")}
                  onPress={() => {
                    void openInsight(animal);
                  }}
                  variant="secondary"
                />
              </AppCard>
            );
          })
        )}
      </View>

      <AppModalSheet
        onRequestClose={() => setInsightState(null)}
        visible={insightState !== null}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {t("marketplace.insightModalTitle", { breed: insightState?.breed })}
          </Text>
          <Text style={styles.modalText}>
            {isInsightLoading ? t("marketplace.modalLoading") : insightState?.text}
          </Text>
        </View>
      </AppModalSheet>

      <AppModalSheet
        onRequestClose={() => setSelectedBreeder(null)}
        visible={selectedBreeder !== null}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedBreeder?.name}</Text>
          <Text style={styles.modalText}>
            {isTrustLoading ? t("marketplace.trustLoading") : trustSummary}
          </Text>
          {selectedBreeder ? (
            <Text style={styles.modalText}>
              {t("marketplace.breederRating", {
                rating: getAverageRating(selectedBreeder.reviews),
                count: selectedBreeder.reviews.length,
              })}
            </Text>
          ) : null}
        </View>
      </AppModalSheet>
    </AppScreen>
  );
}

type FilterGroupProps<TLabel extends string> = {
  options: Array<{
    label: string;
    value: TLabel;
  }>;
  selected: TLabel;
  onSelect: (label: TLabel) => void;
};

function FilterGroup<TLabel extends string>({
  options,
  selected,
  onSelect,
}: FilterGroupProps<TLabel>) {
  return (
    <View style={styles.filterGroup}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={({ pressed }) => [
            styles.filterButton,
            selected === option.value && styles.filterButtonActive,
            pressed && styles.interactivePressed,
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              selected === option.value && styles.filterButtonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
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
  filterGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: appTheme.spacing.xs,
  },
  filterButton: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: 8,
  },
  filterButtonActive: {
    backgroundColor: appTheme.colors.primary,
  },
  filterButtonText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
    fontWeight: "700",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  emptyTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  emptyText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
  },
  animalCard: {
    gap: appTheme.spacing.sm,
  },
  animalImage: {
    borderRadius: appTheme.radius.md,
    height: 220,
    width: "100%",
  },
  animalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  animalTitleBlock: {
    gap: 2,
  },
  animalName: {
    color: appTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  animalBreed: {
    color: appTheme.colors.primaryDark,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  price: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "800",
  },
  description: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 22,
  },
  breederButton: {
    backgroundColor: appTheme.colors.accent,
    borderRadius: appTheme.radius.md,
    gap: 4,
    padding: appTheme.spacing.sm,
  },
  breederName: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    fontWeight: "700",
  },
  breederMeta: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.caption,
  },
  interactivePressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
  modalContent: {
    gap: appTheme.spacing.sm,
  },
  modalTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.section,
    fontWeight: "800",
  },
  modalText: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.body,
    lineHeight: 22,
  },
});
