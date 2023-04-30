export type ListItem = {
  id: string;
  listId: string;
  name: string;
  isDone: boolean;
  amount: number;
};

export type CreateListItemRequest = {
  listId: string;
  name: string;
  amount: number;
};

export type UpdateListItemRequest = ListItem;

export type DeleteListItemRequest = {
  id: string;
  listId: string;
};
