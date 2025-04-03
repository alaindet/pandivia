import { ActionsMenuItem } from '../actions-menu';

export type CardListItem = {
  id: string;
  name: string;
  description: string;
  isDone?: boolean;
  amount?: number;
  category?: string;
} & Record<string, any>;

export type CardListItemActionsFn<T = any> = (item: T) => ActionsMenuItem[];

export type CardListItemActionOutput = { itemId: string; action: string };

export type CardListItemToggledOutput = { itemId: string; isDone: boolean };

export type CardListComponentLabels = {
  pinned: string;
  unpinned: string;
};

export type CardListCounters = {
  done: number;
  total: number;
};
