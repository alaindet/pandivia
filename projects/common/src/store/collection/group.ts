import { CategorizedItems } from './types';

export function extractCategories<
  T extends Record<string, any> & { category?: string }
>(items: T[]): string[] {
  const categories = new Set<string>();

  items.forEach((item) => {
    if (item.category && !categories.has(item.category)) {
      categories.add(item.category);
    }
  });

  return [...categories];
}

export function groupItemsByCategory<T extends { category?: string }>(
  items: T[],
  defaultCategory: string = 'uncategorized'
): CategorizedItems<T>[] {
  const grouped: Record<string, T[]> = {};

  for (const item of items) {
    const category = item.category ?? defaultCategory;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  }

  return Object.entries(grouped).map(([category, items]) => {
    return { category, items };
  });
}
