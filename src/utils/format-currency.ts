const brazilianCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(valueInCents: number) {
  return brazilianCurrencyFormatter.format(valueInCents / 100);
}
