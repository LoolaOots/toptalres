// Derives a display label from a cuisine enum value.
// e.g. 'middle_eastern' → 'Middle Eastern', 'sushi' → 'Sushi'
export function cuisineLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
