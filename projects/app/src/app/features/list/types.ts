import { ObjectValues } from '@app/common/types';

export type ListItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isDone: boolean;
  amount: number;
};

export type CreateListItemDto = Omit<ListItem, 'id' | 'isDone'>;

export type CategorizedListItems = {
  category: string | 'no-category';
  items: ListItem[];
};

export const LIST_FILTER = {
  CATEGORY: 'category',
  IS_DONE: 'isDone',
} as const;

export type ListFilter = ObjectValues<typeof LIST_FILTER>;

export type ListFilters = {
  [LIST_FILTER.CATEGORY]: string | null;
  [LIST_FILTER.IS_DONE]: boolean | null;
};

export type ListFilterToken = {
  key: ListFilter;
  label?: string; // This is translated
  value: any; // TODO: Add type
};
