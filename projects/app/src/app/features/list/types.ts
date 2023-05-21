export type ListItem = {
  id: string;
  name: string;
  amount: number;
  isDone: boolean;
  description?: string;
  category?: string;
};

export type CategorizedListItems = {
  category: string | 'no-category';
  items: ListItem[];
};
