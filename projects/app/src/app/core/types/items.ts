export type InventoryItem = {
  id: string;
  name: string;
  amount: number;
  description?: string;
  category?: string;
};

export type ListItem = InventoryItem & {
  isDone: boolean;
};

export type CategorizedListItems = {
  category: string | 'no-category';
  items: ListItem[];
};
