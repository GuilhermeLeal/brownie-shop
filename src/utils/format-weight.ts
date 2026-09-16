const WEIGHT_PATTERN = /(?:±\s*)?(\d+(?:[.,]\d+)?)\s*(kg|g)\b/gi;
const FIRST_WEIGHT_PATTERN = /(?:±\s*)?(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i;

function formatWeight(amount: string, unit: string) {
  return `± ${amount} ${unit}`;
}

export function formatApproximateWeight(value: string) {
  return value.replace(
    WEIGHT_PATTERN,
    (_match, amount: string, unit: string) => formatWeight(amount, unit),
  );
}

export function extractApproximateWeight(value: string) {
  const match = FIRST_WEIGHT_PATTERN.exec(value);

  return match ? formatWeight(match[1], match[2]) : null;
}
