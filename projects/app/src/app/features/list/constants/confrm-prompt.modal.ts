import { ConfirmPromptModalInput } from '../components/confirm-prompt-modal';
import { CATEGORY_ACTION_REMOVE, CATEGORY_ACTION_REMOVE_COMPLETED } from '../category.contextual-menu';
import { LIST_ACTION_REMOVE, LIST_ACTION_REMOVE_COMPLETED } from '../list.contextual-menu';
import { ITEM_ACTION_REMOVE } from '../item.contextual-menu';

export const LIST_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: LIST_ACTION_REMOVE_COMPLETED.id,
  type: 'list',
  value: null,
  title: 'Remove completed items', // TODO: Translate
  message: 'Do you want to remove all completed items from the list?', // TODO: Translate
};

export const LIST_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: LIST_ACTION_REMOVE.id,
  type: 'list',
  value: null,
  title: 'Remove list', // TODO: Translate
  message: 'Do you want to remove all items from the list?', // TODO: Translate
};

export const CATEGORY_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: CATEGORY_ACTION_REMOVE_COMPLETED.id,
  type: 'category',
  value: null,
  title: 'Remove completed items', // TODO: Translate
  message: 'Do you want to remove all completed items from the category?', // TODO: Translate
};

export const CATEGORY_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: CATEGORY_ACTION_REMOVE.id,
  type: 'category',
  value: null,
  title: 'Remove list', // TODO: Translate
  message: 'Do you want to remove all items from the category?', // TODO: Translate
};

export const ITEM_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: ITEM_ACTION_REMOVE.id,
  type: 'item',
  value: null,
  title: 'Remove item', // TODO: Translate
  message: 'Do you want to remove this item?', // TODO: Translate
};