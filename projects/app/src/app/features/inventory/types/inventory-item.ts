import { CardListItem } from '@fruit/components';

export type InventoryItem = CardListItem & {
  id: string;
  name: string;
  description?: string;
  category?: string;
};

export type CreateInventoryItemDto = Omit<InventoryItem, 'id'>;

export type CategorizedInventoryItems = {
  category: string;
  items: InventoryItem[];
};
