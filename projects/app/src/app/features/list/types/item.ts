export type ListItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isDone: boolean;
  amount: number;
};

export type CreateListItemDto = {
  name: string;
  description?: string;
  category?: string;
  amount: number;
};
