const WEIGHT_PATTERN = /(?:±\s*)?(\d+(?:[.,]\d+)?)\s*(kg|g)\b/gi;

export function formatApproximateWeight(value: string) {
  return value.replace(
    WEIGHT_PATTERN,
    (_match, amount: string, unit: string) => `± ${amount} ${unit}`,
  );
}
