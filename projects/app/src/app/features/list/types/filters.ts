import { EnumLike } from '@common/types';

export const LIST_FILTER = {
  CATEGORY: 'category',
  IS_DONE: 'isDone',
  SEARCH_QUERY: 'searchQuery',
} as const;

export type ListFilter = EnumLike<typeof LIST_FILTER>;

export type ListFilters = {
  [LIST_FILTER.CATEGORY]: string | null;
  [LIST_FILTER.IS_DONE]: boolean | null;
  [LIST_FILTER.SEARCH_QUERY]: string | null;
};

export type ListFilterToken<T = any> = {
  key: ListFilter;
  label?: string; // This is translated
  value: T;
};
