import { CreateInventoryItemDto, InventoryItem } from '../../types';

export type InventoryChangeCategoryModalInput = {
  title: string;
  item?: InventoryItem;
};

export type InventoryChangeCategoryModalOutput = {
  category: string;
};
