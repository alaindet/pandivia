import { CreateInventoryItemDto, InventoryItem } from '@app/core';

export type InventoryItemFormModalInput = {
  title: string; // TODO: Translate
  item: InventoryItem | null;
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

export const INVENTORY_ITEM_FORM_FIELD = {
  NAME: 'name',
  AMOUNT: 'amount',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
} as const;
