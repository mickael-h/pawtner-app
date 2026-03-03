import { Animal, AnimalType } from "../../shared/domain/models";

export type ChartPoint = {
  label: string;
  value: number;
  ratio: number;
};

export function buildMonthlySalesPoints(
  monthlySales: number[],
): ChartPoint[] {
  if (monthlySales.length === 0) {
    return [];
  }

  const maxValue = Math.max(...monthlySales, 1);

  return monthlySales.map((value, index) => ({
    label: `M${index + 1}`,
    value,
    ratio: value / maxValue,
  }));
}

export function buildAnimalTypeDistribution(animals: Animal[]): ChartPoint[] {
  const counters: Record<AnimalType, number> = {
    [AnimalType.DOG]: 0,
    [AnimalType.CAT]: 0,
    [AnimalType.HORSE]: 0,
  };

  animals.forEach((animal) => {
    counters[animal.type] += 1;
  });

  const maxValue = Math.max(...Object.values(counters), 1);

  return Object.entries(counters).map(([label, value]) => ({
    label,
    value,
    ratio: value / maxValue,
  }));
}
