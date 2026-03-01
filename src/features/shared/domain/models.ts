export enum AnimalType {
  DOG = "Chien",
  CAT = "Chat",
  HORSE = "Cheval",
}

export enum ListingType {
  SALE = "Vente",
  STUD = "Saillie",
}

export enum CycleStatus {
  REST = "Repos",
  HEAT = "Chaleurs",
  PREGNANCY = "Gestation",
  LACTATION = "Allaitement",
}

export type Gender = "M" | "F";

export type SearchFilter = AnimalType | "All";
export type ListingFilter = ListingType | "All";

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  gender: Gender;
  birthDate: string;
  price: number;
  location: string;
  listingType: ListingType;
  imageUrl: string;
  cycleStatus?: CycleStatus;
  isAvailableForClub?: boolean;
  breederId: string;
  description: string;
}

export interface Breeder {
  id: string;
  name: string;
  labelScore: number;
  isCertified: boolean;
  isFamilyStyle: boolean;
  location: string;
  specialties: string[];
  reviews: Review[];
}

export interface PriceAuditPayload {
  type: AnimalType;
  breed: string;
  price: number;
}
