import { SortingFn } from './types';

export function compareByAscendingKey<T extends Record<string, any>>(
  key: string
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
