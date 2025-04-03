export type InventoryItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
};

export type CreateInventoryItemDto = {
  name: string;
  description?: string;
  category?: string;
};

export type CategorizedInventoryItems = {
  category: string;
  items: InventoryItem[];
};
