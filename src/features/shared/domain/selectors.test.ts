import assert from "node:assert/strict";
import test from "node:test";

import { AnimalType, ListingType } from "./models";
import { mockAnimals, mockBreeders } from "../data/mockData";
import { filterAnimals, getAverageRating, getBreederById, getFemaleAnimals } from "./selectors";

test("filterAnimals applies type filter", () => {
  const filtered = filterAnimals({
    animals: mockAnimals,
    searchQuery: "",
    selectedType: AnimalType.CAT,
    selectedListing: "All",
  });

  assert.ok(filtered.length > 0);
  assert.equal(filtered.every((animal) => animal.type === AnimalType.CAT), true);
});

test("filterAnimals applies search and listing filters", () => {
  const filtered = filterAnimals({
    animals: mockAnimals,
    searchQuery: "max",
    selectedType: "All",
    selectedListing: ListingType.STUD,
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.name, "Max");
});

test("getBreederById returns matching breeder", () => {
  const breeder = getBreederById(mockBreeders, "b1");
  assert.equal(breeder?.name, "Élevage du Val d'Émeraude");
});

test("getAverageRating computes one decimal score", () => {
  const breeder = getBreederById(mockBreeders, "b1");
  assert.equal(getAverageRating(breeder?.reviews ?? []), 4.7);
});

test("getFemaleAnimals returns only females", () => {
  const females = getFemaleAnimals(mockAnimals);
  assert.ok(females.length > 0);
  assert.equal(females.every((animal) => animal.gender === "F"), true);
});
