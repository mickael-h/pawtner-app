import assert from "node:assert/strict";
import test from "node:test";

import { formatMonthYear, formatPriceEur } from "./formatters";

test("formatPriceEur renders French formatted value", () => {
  const value = formatPriceEur(12400);
  assert.equal(value.endsWith(" EUR"), true);
  assert.equal(value.includes("12"), true);
  assert.equal(value.includes("400"), true);
});

test("formatMonthYear renders month and year in French", () => {
  const value = formatMonthYear("2024-01-15");
  assert.equal(value.includes("2024"), true);
});
