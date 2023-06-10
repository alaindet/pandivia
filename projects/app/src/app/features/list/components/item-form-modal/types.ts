import { CreateListItemDto, ListItem } from '@app/core';

export type ItemFormModalInput = {
  title: string; // TODO: Translate
  item: ListItem | null;
};

export type CreateItemFormModalOutput = {
  item: CreateListItemDto;
  addToInventory: boolean;
};

export type EditItemFormModalOutput = {
  item: ListItem;
};

export type ItemFormModalOutput = (
  | CreateItemFormModalOutput
  | EditItemFormModalOutput
);

export const ITEM_FORM_FIELD = {
  NAME: 'name',
  AMOUNT: 'amount',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  IS_DONE: 'isDone',
  ADD_TO_INVENTORY: 'addToInventory',
} as const;
