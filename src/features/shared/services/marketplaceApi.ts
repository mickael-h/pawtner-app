import { apiFetch } from "../../../services/httpClient";
import {
  Animal,
  AnimalType,
  Breeder,
  CycleStatus,
  ListingType,
  Review,
} from "../domain/models";

type ApiAnimalType = "dog" | "cat" | "horse";
type ApiListingType = "sale" | "stud";
type ApiCycleStatus = "rest" | "heat" | "pregnancy" | "nursing" | null;

type OfferDto = {
  id: string;
  merchant_user_id: string;
  name: string;
  animal_type: ApiAnimalType;
  breed: string;
  gender: "M" | "F";
  birth_date: string;
  price_eur: number;
  location: string;
  listing_type: ApiListingType;
  image_url: string;
  cycle_status: ApiCycleStatus;
  is_available_for_club: boolean;
  description: string;
};

type PagedOffersDto = {
  items: OfferDto[];
  total: number;
  page: number;
  page_size: number;
};

type MerchantProfileWithReviewsDto = {
  profile: {
    merchant_user_id: string;
    profile_code: string;
    label_score: number;
    is_certified: boolean;
    is_family_style: boolean;
    location: string;
    specialties: string[];
  };
  reviews: Array<{
    id: string;
    author_name: string;
    rating: number;
    comment: string;
    reviewed_at: string;
  }>;
};

type MetricsDto = {
  series: Array<{
    metric_year: number;
    month_index: number;
    amount_eur: number;
  }>;
};

type FetchOffersFilters = {
  animalType?: ApiAnimalType;
  listingType?: ApiListingType;
  status?: "draft" | "published" | "archived";
};

function mapAnimalType(value: ApiAnimalType): AnimalType {
  if (value === "dog") {
    return AnimalType.DOG;
  }

  if (value === "cat") {
    return AnimalType.CAT;
  }

  return AnimalType.HORSE;
}

function mapListingType(value: ApiListingType): ListingType {
  if (value === "sale") {
    return ListingType.SALE;
  }

  return ListingType.STUD;
}

function mapCycleStatus(value: ApiCycleStatus): CycleStatus | undefined {
  if (value === null) {
    return undefined;
  }

  if (value === "rest") {
    return CycleStatus.REST;
  }

  if (value === "heat") {
    return CycleStatus.HEAT;
  }

  if (value === "pregnancy") {
    return CycleStatus.PREGNANCY;
  }

  return CycleStatus.LACTATION;
}

export function toApiAnimalType(value: AnimalType | "All"): ApiAnimalType | undefined {
  if (value === "All") {
    return undefined;
  }

  if (value === AnimalType.DOG) {
    return "dog";
  }

  if (value === AnimalType.CAT) {
    return "cat";
  }

  return "horse";
}

export function toApiListingType(
  value: ListingType | "All",
): ApiListingType | undefined {
  if (value === "All") {
    return undefined;
  }

  if (value === ListingType.SALE) {
    return "sale";
  }

  return "stud";
}

function mapOfferToAnimal(offer: OfferDto): Animal {
  return {
    id: offer.id,
    name: offer.name,
    type: mapAnimalType(offer.animal_type),
    breed: offer.breed,
    gender: offer.gender,
    birthDate: offer.birth_date,
    price: offer.price_eur,
    location: offer.location,
    listingType: mapListingType(offer.listing_type),
    imageUrl: offer.image_url,
    cycleStatus: mapCycleStatus(offer.cycle_status),
    isAvailableForClub: offer.is_available_for_club,
    breederId: offer.merchant_user_id,
    description: offer.description,
  };
}

export async function fetchMarketplaceAnimals(
  filters: FetchOffersFilters = {},
): Promise<Animal[]> {
  const query = new URLSearchParams();
  query.set("page", "1");
  query.set("page_size", "50");
  query.set("status", filters.status ?? "published");

  if (filters.animalType) {
    query.set("animal_type", filters.animalType);
  }

  if (filters.listingType) {
    query.set("listing_type", filters.listingType);
  }

  const response = await apiFetch<PagedOffersDto>(
    `/api/v1/marketplace/offers?${query.toString()}`,
  );

  return response.items.map(mapOfferToAnimal);
}

export async function fetchMerchantAnimals(): Promise<Animal[]> {
  const response = await apiFetch<PagedOffersDto>(
    "/api/v1/merchant/offers?status=published&page=1&page_size=50",
  );

  return response.items.map(mapOfferToAnimal);
}

export async function fetchMerchantBreeder(merchantId: string): Promise<Breeder> {
  const response = await apiFetch<MerchantProfileWithReviewsDto>(
    `/api/v1/marketplace/merchants/${merchantId}/reviews`,
  );

  const reviews: Review[] = response.reviews.map((review) => ({
    id: review.id,
    author: review.author_name,
    rating: review.rating,
    comment: review.comment,
    date: review.reviewed_at,
  }));

  return {
    id: response.profile.merchant_user_id,
    // Backend does not provide merchant display name on this endpoint.
    name: `Éleveur ${response.profile.profile_code}`,
    labelScore: response.profile.label_score,
    isCertified: response.profile.is_certified,
    isFamilyStyle: response.profile.is_family_style,
    location: response.profile.location,
    specialties: response.profile.specialties,
    reviews,
  };
}

export async function fetchMonthlySalesAmounts(): Promise<number[]> {
  const response = await apiFetch<MetricsDto>("/api/v1/metrics/monthly-sales");

  return response.series
    .slice()
    .sort((left, right) => {
      if (left.metric_year !== right.metric_year) {
        return left.metric_year - right.metric_year;
      }

      return left.month_index - right.month_index;
    })
    .map((item) => item.amount_eur);
}
