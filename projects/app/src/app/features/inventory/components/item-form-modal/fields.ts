export const INVENTORY_ITEM_FORM_FIELD_NAME = {
  id: 'name',
  htmlId: 'inventory-item-name',
  errors: {
    REQUIRED: 'item-name-required',
    LENGTH: 'item-name-length',
    UNIQUE: 'item-name-unique',
  },
} as const;

export const INVENTORY_ITEM_FORM_FIELD_DESCRIPTION = {
  id: 'description',
  htmlId: 'inventory-item-description',
  errors: {
    LENGTH: 'item-description-length',
  }
} as const;

export const INVENTORY_ITEM_FORM_FIELD_CATEGORY = {
  id: 'category',
  htmlId: 'inventory-item-category',
  errors: {
    LENGTH: 'item-category-length',
  },
} as const;

export const INVENTORY_ITEM_FORM_FIELD = {
  NAME: INVENTORY_ITEM_FORM_FIELD_NAME,
  DESCRIPTION: INVENTORY_ITEM_FORM_FIELD_DESCRIPTION,
  CATEGORY: INVENTORY_ITEM_FORM_FIELD_CATEGORY,
} as const;
