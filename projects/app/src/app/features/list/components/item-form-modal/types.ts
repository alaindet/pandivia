import { CreateListItemDto, ListItem } from '../../types';

export type ListItemFormModalInput = {
  title: string; // TODO: Translate
  item: ListItem | null;
};

export type CreateListItemFormModalOutput = {
  item: CreateListItemDto;
  addToInventory: boolean;
};

export type EditListItemFormModalOutput = {
  item: ListItem;
};

export type ListItemFormModalOutput = (
  | CreateListItemFormModalOutput
  | EditListItemFormModalOutput
);

export const LIST_ITEM_FORM_FIELD = {
  NAME: 'name',
  AMOUNT: 'amount',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  IS_DONE: 'isDone',
  ADD_TO_INVENTORY: 'addToInventory',
} as const;
