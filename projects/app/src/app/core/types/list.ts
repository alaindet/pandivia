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
