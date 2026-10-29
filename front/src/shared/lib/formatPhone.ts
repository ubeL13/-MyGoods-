export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.length !== 11) return value

  return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}
