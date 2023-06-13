export type InventoryItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
};

export type CreateInventoryItemDto = Omit<InventoryItem, 'id'>;

export type CategorizedInventoryItems = {
  category: string | 'no-category';
  items: InventoryItem[];
};
