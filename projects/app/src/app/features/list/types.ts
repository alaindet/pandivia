export type ListItem = {
  id: string;
  name: string;
  amount: number;
  isDone: boolean;
  description?: string;
  category?: string;
};

export type GroupedListItems = {
  category: string | 'no-category';
};
