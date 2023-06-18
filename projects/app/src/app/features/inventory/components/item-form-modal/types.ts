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

export const INVENTORY_ITEM_FORM_FIELD = {
  NAME: {
    id: 'name',
    errors: {
      REQUIRED: 'item-name-required',
      LENGTH: 'item-name-length',
      UNIQUE: 'item-name-unique',
    },
  },
  DESCRIPTION: {
    id: 'description',
    errors: {
      LENGTH: 'item-description-length',
    }
  },
  CATEGORY: {
    id: 'category',
    errors: {
      LENGTH: 'item-category-length',
    },
  },
} as const;