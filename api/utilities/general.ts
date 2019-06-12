export function dedupeArray<A>(a: A[]): A[] {
  return [...new Set(a)];
}
