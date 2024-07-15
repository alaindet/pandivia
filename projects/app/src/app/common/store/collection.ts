import { CACHE_MAX_AGE, DEFAULT_CATEGORY } from '@app/core';
import { Counters, LOADING_STATUS, LoadingStatus, UnixTimestamp } from '../types';

export type SortingFn<T = any> = (a: T, b: T) => -1 | 0 | 1;

export type CategorizedItems<T extends Record<string, any>> = {
  category: string;
  items: T[];
};

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

export function countDoneItems<T extends (
  Record<string, any> & { isDone?: boolean; }
)>(
  items: T[],
): Counters {
  if (items.length === 0) {
    return { completed: null, total: 0 };
  }

  const withIsDoneProperty = items[0].isDone !== undefined;
  const total = items.length;

  if (!withIsDoneProperty) {
    return { completed: null, total };
  }

  const completed = items.filter(item => item.isDone).length;
  return { completed, total };
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

export function filterItemsByQuery(
  items: string[],
  _query: string,
): string[] {
  const query = _query.toLowerCase();
  return items.filter(item => item.toLowerCase().includes(query));
}

export function filterItemsByName<T extends (
  Record<string, any> & { name: string; }
)>(items: T[], name: string): T[] {
  const query = name.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(query));
}

export function sortItemsByName<T extends { name: string }>(
  items: T[],
): T[] {
  const newItems = [...items];
  newItems.sort(compareByAscendingKey('name'));
  return newItems;
}

export function compareByAscendingKey<T extends Record<string, any>>(
  key: string,
): SortingFn<T> {
  const getter = (item: T): T[typeof key] => item[key];

  return (a: T, b: T): -1 | 0 | 1 => {
    const aValue = getter(a);
    const bValue = getter(b);

    if (aValue === bValue) {
      return 0;
    }

    return aValue < bValue ? -1 : 1;
  };
}

export function groupItemsByCategory<T extends { category?: string; }>(
  items: T[],
): CategorizedItems<T>[] {
  const grouped: Record<string, T[]> = {};

  for (const item of items) {
    const category = item.category ?? DEFAULT_CATEGORY;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  };

  return Object.entries(grouped).map(([category, items]) => {
    return { category, items };
  });
}
