import { ObjectValues } from '@app/common/types';

export const LIST_FILTER = {
  CATEGORY: 'category',
  IS_DONE: 'isDone',
} as const;

export type ListFilter = ObjectValues<typeof LIST_FILTER>;

export type ListFilters = {
  [LIST_FILTER.CATEGORY]: string | null;
  [LIST_FILTER.IS_DONE]: boolean | null;
};