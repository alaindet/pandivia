import { EnumLike } from '../types';

const FILTER_TYPE = {
  EXACT: 'exact',
  LIKE: 'like',
} as const;

export type FilterType = EnumLike<typeof FILTER_TYPE>;

type Filter<T = string | number> = {
  name: string;
  value: T;
  type: FilterType;
};

type FilterCreator = <T extends string | number>(name: string, value: T) => Filter;

type FilterCreators = {
  exact: FilterCreator;
  like: FilterCreator;
};


export function createFilters(
  fn: (f: FilterCreators) => Filter[],
): Filter[] {

  function exact<T = string | number>(name: string, value: T) {
    return { name, value, type: FILTER_TYPE.EXACT };
  }

  function like<T = string | number>(name: string, value: T) {
    return { name, value, type: FILTER_TYPE.LIKE };
  }

  return fn({ exact, like });
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
