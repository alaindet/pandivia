import { CACHE_MAX_AGE, DEFAULT_CATEGORY } from '@app/core';
import {
  Counters,
  LOADING_STATUS,
  LoadingStatus,
  UnixTimestamp,
} from '@common/types';

import { CategorizedItems } from './types';
import { compareByAscendingKey } from './compare';

export function shouldFetchCollection<T extends Record<string, any>>(
  items: T[],
  status: LoadingStatus,
  lastUpdated: UnixTimestamp | null
) {
  return (
    status === LOADING_STATUS.PRISTINE ||
    lastUpdated === null ||
    Date.now() - lastUpdated > CACHE_MAX_AGE ||
    items.length === 0
  );
}

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

export function countDoneItems<
  T extends Record<string, any> & { isDone?: boolean }
>(items: T[]): Counters {
  if (items.length === 0) {
    return { completed: null, total: 0 };
  }

  const withIsDoneProperty = items[0].isDone !== undefined;
  const total = items.length;

  if (!withIsDoneProperty) {
    return { completed: null, total };
  }

  const completed = items.filter((item) => item.isDone).length;
  return { completed, total };
}

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

export function sortItemsByName<T extends { name: string }>(items: T[]): T[] {
  const newItems = [...items];
  newItems.sort(compareByAscendingKey('name'));
  return newItems;
}

export function groupItemsByCategory<T extends { category?: string }>(
  items: T[]
): CategorizedItems<T>[] {
  const grouped: Record<string, T[]> = {};

  for (const item of items) {
    const category = item.category ?? DEFAULT_CATEGORY;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  }

  return Object.entries(grouped).map(([category, items]) => {
    return { category, items };
  });
}
