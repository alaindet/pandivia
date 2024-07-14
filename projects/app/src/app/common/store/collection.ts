import { CACHE_MAX_AGE } from "../../core";
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from "../types";

export function shouldFetchCollection<T extends Record<string, any>>(
  items: T[],
  status: LoadingStatus,
  lastUpdated: UnixTimestamp | null,
) {
  return (
    status === LOADING_STATUS.PRISTINE ||
    lastUpdated === null ||
    (Date.now() - lastUpdated > CACHE_MAX_AGE) ||
    items.length === 0
  );
}

export function extractCategories<T extends (
  Record<string, any> & { category?: string; }
)>(
  items: T[],
): string[] {
  const categories = new Set<string>();

  items.forEach(item => {
    if (item.category && !categories.has(item.category)) {
      categories.add(item.category);
    }
  });

  return Object.keys(categories);
}

export function getItemByExactId<T extends (
  Record<string, any> & { id: string; }
)>(items: T[], itemId: string): T | null {
  const item = items.find(item => item.id === itemId);
  return item ?? null;
}

export function getItemByName<T extends (
  Record<string, any> & { name: string; }
)>(items: T[], name: string): T | null {
  const query = name.toLowerCase();
  const item = items.find(item => item.name.toLowerCase() === query);
  return item ?? null;
}

export function filterItems(items: string[], _query: string): string[] {
  const query = _query.toLowerCase();
  return items.filter(item => item.toLowerCase().includes(query));
}

export function filterItemsByName<T extends (
  Record<string, any> & { name: string; }
)>(items: T[], name: string): T[] {
  const query = name.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(query));
}
