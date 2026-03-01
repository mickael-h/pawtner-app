export function formatPriceEur(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} EUR`;
}

export function formatMonthYear(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}
