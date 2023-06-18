import { CreateListItemDto, ListItem } from '../../types';

export type ListItemFormModalInput = {
  title: string;
  item?: ListItem;
  category?: string;
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
