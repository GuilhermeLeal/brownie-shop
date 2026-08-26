export function normalizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 13);
}

function formatLocalPhone(digits: string) {
  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2, 11);
  const firstPartLength = number.length > 8 ? 5 : 4;
  const firstPart = number.slice(0, firstPartLength);
  const secondPart = number.slice(firstPartLength);

  return `(${areaCode}) ${firstPart}${secondPart ? `-${secondPart}` : ""}`;
}

export function formatPhone(value: string) {
  const digits = normalizePhone(value);
  const hasCountryCode = digits.startsWith("55") && digits.length > 11;

  if (hasCountryCode) {
    return `+55 ${formatLocalPhone(digits.slice(2))}`;
  }

  return formatLocalPhone(digits);
}

export function isValidBrazilianPhone(value: string) {
  const digits = normalizePhone(value);
  const localDigits =
    digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;

  return localDigits.length === 10 || localDigits.length === 11;
}
