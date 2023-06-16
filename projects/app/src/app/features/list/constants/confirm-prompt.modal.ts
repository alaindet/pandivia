import { ConfirmPromptModalInput } from '@app/common/components';
import * as listMenu from '../contextual-menus/list';
import * as categoryMenu from '../contextual-menus/category';
import * as itemMenu from '../contextual-menus/item';

export const LIST_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: listMenu.LIST_ACTION_REMOVE_COMPLETED.id,
  title: 'list.prompt.removeCompleted.title',
  message: 'list.prompt.removeCompleted.message',
};

export const LIST_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: listMenu.LIST_ACTION_REMOVE.id,
  title: 'list.prompt.removeAll.title',
  message: 'list.prompt.removeAll.message',
};

export const CATEGORY_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE_COMPLETED.id,
  title: 'list.prompt.removeCategoryCompleted.title',
  message: 'list.prompt.removeCategoryCompleted.message',
};

export const CATEGORY_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE.id,
  title: 'list.prompt.removeCategoryAll.title',
  message: 'list.prompt.removeCategoryAll.message',
};

export const ITEM_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: itemMenu.ITEM_ACTION_REMOVE.id,
  title: 'list.prompt.removeItem.title',
  message: 'list.prompt.removeItem.message',
};
