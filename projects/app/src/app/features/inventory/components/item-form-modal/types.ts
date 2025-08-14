import { CreateInventoryItemDto, InventoryItem } from '../../types';

export type InventoryItemFormModalInput = {
  title: string;
  item?: InventoryItem;
  category?: string;
  name?: string;
};

export type CreateInventoryItemFormModalOutput = {
  item: CreateInventoryItemDto;
};

export type EditInventoryItemFormModalOutput = {
  item: InventoryItem;
};

export type InventoryItemFormModalOutput = (
  | CreateInventoryItemFormModalOutput
  | EditInventoryItemFormModalOutput
);
