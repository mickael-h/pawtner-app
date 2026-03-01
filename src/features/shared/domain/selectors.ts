import {
  Animal,
  Breeder,
  ListingFilter,
  SearchFilter,
} from "./models";

type AnimalFilterInput = {
  animals: Animal[];
  searchQuery: string;
  selectedType: SearchFilter;
  selectedListing: ListingFilter;
};

export function filterAnimals(input: AnimalFilterInput): Animal[] {
  const normalizedSearch = input.searchQuery.trim().toLowerCase();

  return input.animals.filter((animal) => {
    const matchesType =
      input.selectedType === "All" || animal.type === input.selectedType;
    const matchesListing =
      input.selectedListing === "All" ||
      animal.listingType === input.selectedListing;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      animal.name.toLowerCase().includes(normalizedSearch) ||
      animal.breed.toLowerCase().includes(normalizedSearch);

    return matchesType && matchesListing && matchesSearch;
  });
}

export function getBreederById(
  breeders: Breeder[],
  breederId: string,
): Breeder | undefined {
  return breeders.find((breeder) => breeder.id === breederId);
}

export function getAverageRating(reviews: Breeder["reviews"]): number {
  if (reviews.length === 0) {
    return 0;
  }

  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

export function getFemaleAnimals(animals: Animal[]): Animal[] {
  return animals.filter((animal) => animal.gender === "F");
}
