import { ConfirmPromptModalInput } from '@fruit/components/modal';

import * as listMenu from '../contextual-menus/list';
import * as categoryMenu from '../contextual-menus/category';
import * as itemMenu from '../contextual-menus/item';

export const LIST_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: listMenu.LIST_ACTION_REMOVE_COMPLETED.id,
  title: 'common.prompt.removeCompleted.title',
  message: 'common.prompt.removeCompleted.message',
};

export const CATEGORY_REMOVE_COMPLETED_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE_COMPLETED.id,
  title: 'common.prompt.removeCategoryCompleted.title',
  message: 'common.prompt.removeCategoryCompleted.message', // params: categoryName
};

export const CATEGORY_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE.id,
  title: 'common.prompt.removeCategory.title',
  message: 'common.prompt.removeCategory.message', // params: categoryName
};

export const ITEM_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: itemMenu.ITEM_ACTION_REMOVE.id,
  title: 'common.prompt.removeItem.title',
  message: 'common.prompt.removeItem.message', // params: itemName
};
