import { CreateInventoryItemDto, InventoryItem } from '../../types';

export type InventoryItemFormModalInput = {
  title: string; // TODO: Translate
  item?: InventoryItem;
  category?: string;
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
