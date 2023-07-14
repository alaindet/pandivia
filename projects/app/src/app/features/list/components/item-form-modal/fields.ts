export const LIST_ITEM_FORM_FIELD_NAME = {
  id: 'name',
  htmlId: 'list-item-name',
  errors: {
    REQUIRED: 'item-name-required',
    LENGTH: 'item-name-length',
    UNIQUE: 'item-name-unique',
  },
} as const;

export const LIST_ITEM_FORM_FIELD_AMOUNT = {
  id: 'amount',
  htmlId: 'list-item-amount',
  errors: {
    REQUIRED: 'item-amount-required',
    MIN_MAX: 'item-amount-minmax',
  },
} as const;

export const LIST_ITEM_FORM_FIELD_DESCRIPTION = {
  id: 'description',
  htmlId: 'list-item-description',
  errors: {
    LENGTH: 'item-description-length',
  },
} as const;

export const LIST_ITEM_FORM_FIELD_CATEGORY = {
  id: 'category',
  htmlId: 'list-item-category',
  errors: {
    LENGTH: 'item-category-length',
  },
} as const;

export const LIST_ITEM_FORM_FIELD_IS_DONE = {
  id: 'isDone',
  htmlId: 'list-item-is-done',
  errors: {
    // ...
  },
} as const;

export const LIST_ITEM_FORM_FIELD_ADD_TO_INVENTORY = {
  id: 'addToInventory',
  htmlId: 'list-item-add-to-inventory',
  errors: {
    // ...
  },
} as const;

export const LIST_ITEM_FORM_FIELD = {
  NAME: LIST_ITEM_FORM_FIELD_NAME,
  AMOUNT: LIST_ITEM_FORM_FIELD_AMOUNT,
  DESCRIPTION: LIST_ITEM_FORM_FIELD_DESCRIPTION,
  CATEGORY: LIST_ITEM_FORM_FIELD_CATEGORY,
  IS_DONE: LIST_ITEM_FORM_FIELD_IS_DONE,
  ADD_TO_INVENTORY: LIST_ITEM_FORM_FIELD_ADD_TO_INVENTORY,
} as const;
