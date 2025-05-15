export function formatPhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 0) return "";
  const countryCode = digits.startsWith("7") ? "+7" : "+7";
  let formatted = countryCode;
  const rest = digits.startsWith("7") ? digits.slice(1) : digits;

  if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
  if (rest.length > 3) formatted += `)-${rest.slice(3, 6)}`;
  if (rest.length > 6) formatted += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) formatted += `-${rest.slice(8, 10)}`;

  return formatted;
}
