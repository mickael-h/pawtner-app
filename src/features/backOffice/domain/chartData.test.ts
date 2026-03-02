import assert from "node:assert/strict";
import test from "node:test";

import { mockAnimals } from "../../shared/data/mockData";
import {
  buildAnimalTypeDistribution,
  buildMonthlySalesPoints,
} from "./chartData";

test("buildMonthlySalesPoints normalizes ratios against max value", () => {
  const points = buildMonthlySalesPoints([10, 20, 5]);

  assert.equal(points.length, 3);
  assert.equal(points[0]?.ratio, 0.5);
  assert.equal(points[1]?.ratio, 1);
  assert.equal(points[2]?.ratio, 0.25);
});

test("buildAnimalTypeDistribution includes all animal types with positive counts", () => {
  const points = buildAnimalTypeDistribution(mockAnimals);

  assert.equal(points.length, 3);
  assert.equal(points.every((point) => point.value > 0), true);
  assert.equal(points.every((point) => point.ratio > 0), true);
});
