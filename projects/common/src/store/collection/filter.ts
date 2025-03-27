export function filterItemsByQuery(items: string[], _query: string): string[] {
  const query = _query.toLowerCase();
  return items.filter((item) => item.toLowerCase().includes(query));
}

export function filterItemsByName<
  T extends Record<string, any> & { name: string }
>(items: T[], name: string): T[] {
  const query = name.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(query));
}
