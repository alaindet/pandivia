import { ConfirmPromptModalInput } from '@ui/components/confirm-prompt-modal';

import * as categoryMenu from '../contextual-menus/category';
import * as itemMenu from '../contextual-menus/item';

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
