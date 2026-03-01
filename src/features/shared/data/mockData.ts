import {
  Animal,
  AnimalType,
  Breeder,
  CycleStatus,
  ListingType,
} from "../domain/models";

export const pawtnerPalette = {
  primary: "#10b981",
  secondary: "#0f172a",
  accent: "#f1f5f9",
} as const;

export const heroImageUrl =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1920";

export const familyImageUrl =
  "https://images.unsplash.com/photo-1591768793355-74d7ca736056?auto=format&fit=crop&q=80&w=1200";

export const mockBreeders: Breeder[] = [
  {
    id: "b1",
    name: "Élevage du Val d'Émeraude",
    labelScore: 95,
    isCertified: true,
    isFamilyStyle: true,
    location: "Lyon, FR",
    specialties: ["Golden Retriever", "Maine Coon"],
    reviews: [
      {
        id: "r1",
        author: "Jean D.",
        rating: 5,
        comment: "Éleveur passionné, les chiots sont parfaitement socialisés.",
        date: "2024-01-15",
      },
      {
        id: "r2",
        author: "Marie L.",
        rating: 4,
        comment:
          "Très bon accueil et conseils précieux pour l'arrivée de Luna.",
        date: "2023-11-20",
      },
      {
        id: "r3",
        author: "Paul B.",
        rating: 5,
        comment: "Installation exemplaire. Hygiène irréprochable.",
        date: "2024-02-01",
      },
    ],
  },
  {
    id: "b2",
    name: "Passion Canis",
    labelScore: 88,
    isCertified: true,
    isFamilyStyle: false,
    location: "Bordeaux, FR",
    specialties: ["Berger Australien"],
    reviews: [
      {
        id: "r4",
        author: "Sophie K.",
        rating: 4,
        comment: "Max est un chien adorable et en pleine santé. Merci.",
        date: "2023-12-10",
      },
      {
        id: "r5",
        author: "Lucas M.",
        rating: 3,
        comment: "Un peu difficile à joindre mais l'élevage est sérieux.",
        date: "2024-01-05",
      },
    ],
  },
  {
    id: "b3",
    name: "Haras des Plaines",
    labelScore: 92,
    isCertified: true,
    isFamilyStyle: false,
    location: "Normandie, FR",
    specialties: ["Pur-sang Arabe", "Selle Français"],
    reviews: [
      {
        id: "r6",
        author: "Nicolas V.",
        rating: 5,
        comment:
          "Chevaux d'exception, installations magnifiques et soins de haute qualité.",
        date: "2024-03-10",
      },
    ],
  },
];

export const mockAnimals: Animal[] = [
  {
    id: "a1",
    name: "Rudy",
    type: AnimalType.DOG,
    breed: "Golden Retriever",
    gender: "M",
    birthDate: "2023-05-12",
    price: 1800,
    location: "Lyon, FR",
    listingType: ListingType.SALE,
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
    breederId: "b1",
    description: "Chiot exceptionnel, vacciné et pucé. Caractère très doux.",
  },
  {
    id: "a2",
    name: "Luna",
    type: AnimalType.CAT,
    breed: "Maine Coon",
    gender: "F",
    birthDate: "2022-10-05",
    price: 1500,
    location: "Lyon, FR",
    listingType: ListingType.SALE,
    imageUrl:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800",
    cycleStatus: CycleStatus.REST,
    breederId: "b1",
    description:
      "Magnifique femelle Maine Coon pour compagnie ou reproduction.",
  },
  {
    id: "a3",
    name: "Max",
    type: AnimalType.DOG,
    breed: "Berger Australien",
    gender: "M",
    birthDate: "2021-02-15",
    price: 800,
    location: "Bordeaux, FR",
    listingType: ListingType.STUD,
    imageUrl:
      "https://images.unsplash.com/photo-1506755855567-92ff770e8d00?auto=format&fit=crop&q=80&w=800",
    isAvailableForClub: true,
    breederId: "b2",
    description:
      "Étalon confirmé, excellent pedigree, disponible pour saillies.",
  },
  {
    id: "a4",
    name: "Storm",
    type: AnimalType.HORSE,
    breed: "Pur-sang Arabe",
    gender: "M",
    birthDate: "2020-04-10",
    price: 12500,
    location: "Normandie, FR",
    listingType: ListingType.SALE,
    imageUrl:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    breederId: "b3",
    description:
      "Étalon Pur-sang Arabe avec un pedigree prestigieux. Très agile et équilibré.",
  },
  {
    id: "a5",
    name: "Gaia",
    type: AnimalType.HORSE,
    breed: "Selle Français",
    gender: "F",
    birthDate: "2019-06-22",
    price: 9800,
    location: "Normandie, FR",
    listingType: ListingType.SALE,
    imageUrl:
      "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800",
    breederId: "b3",
    description:
      "Jument Selle Français idéale pour le CSO. Excellente santé et caractère volontaire.",
  },
];
