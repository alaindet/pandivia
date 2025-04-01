import { Counters } from '@fixcommon/types';

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
