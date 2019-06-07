export function dateIsGreaterThan(dateA: string | Date, dateB: string | Date) {
  return new Date(dateA) > new Date(dateB);
}
