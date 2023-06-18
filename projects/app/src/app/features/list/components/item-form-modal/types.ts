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
