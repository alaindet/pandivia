import { CreateListItemDto, ListItem } from '@app/core';

export type ItemFormModalInput = {
  title: string; // TODO: Translate
  item: ListItem | null;
};

export type ItemFormModalOutput = {
  item: ListItem | CreateListItemDto;
};

export const ITEM_FORM_FIELD = {
  NAME: 'name',
  AMOUNT: 'amount',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  IS_DONE: 'isDone',
} as const;
