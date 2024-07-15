import { EnumLike } from '../types';

const FILTER_TYPE = {
  EXACT: 'exact',
  LIKE: 'like',
} as const;

export type FilterType = EnumLike<typeof FILTER_TYPE>;

type Filter<T = string | number | boolean> = {
  name: string;
  value: T;
  type: FilterType;
};

type FilterCreator = <
  T extends string | number | boolean | null | undefined
>(name: string, value: T) => Filter | null;

type FilterCreators = {
  exact: FilterCreator;
  like: FilterCreator;
};


export function createFilters(
  fn: (f: FilterCreators) => (Filter | null)[],
): Filter[] {

  function exact<T extends string | number | boolean>(
    name: string,
    value: T | null | undefined,
  ): Filter<T> | null {

    if (value === null || value === undefined) {
      return null;
    }

    return { name, value, type: FILTER_TYPE.EXACT };
  }

  function like<T extends string | number | boolean>(
    name: string,
    value: T | null | undefined,
  ): Filter<T> | null {

    if (value === null || value === undefined) {
      return null;
    }

    return { name, value, type: FILTER_TYPE.LIKE };
  }

  const rawFilters = fn({ exact, like });
  return rawFilters.filter(f => f !== null);
}

export function filterItems<T extends Record<string, any>>(
  items: T[],
  _filters: Filter[],
): T[] {

  const filters = _filters.map(filter => {
    if (filter.type === FILTER_TYPE.LIKE) {
      return { ...filter, value: (filter.value as string).toLowerCase() };
    }
    return filter;
  });

  return items.filter(item => {
    for (const filter of filters) {

      const itemValue = item[filter.name] ?? '';

      switch (filter.type) {

        case FILTER_TYPE.EXACT:
          if (itemValue !== filter.value) {
            return false;
          }
          break;

        case FILTER_TYPE.LIKE:
          if (!itemValue.toLowerCase().includes(filter.value)) {
            return false;
          }
          break;
      }
    }

    return true;
  });
}
