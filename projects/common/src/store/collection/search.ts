export function getItemByExactId<
  T extends Record<string, any> & { id: string }
>(items: T[], itemId: string): T | null {
  const item = items.find((item) => item.id === itemId);
  return item ?? null;
}

export function getItemByName<T extends Record<string, any> & { name: string }>(
  items: T[],
  name: string
): T | null {
  const query = name.toLowerCase();
  const item = items.find((item) => item.name.toLowerCase() === query);
  return item ?? null;
}
