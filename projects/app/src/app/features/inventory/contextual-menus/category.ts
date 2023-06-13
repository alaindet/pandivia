import { ActionsMenuItem } from '@app/common/components';

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'Remove all items', // TODO: Translate
  icon: 'delete',
};

export const CATEGORY_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  CATEGORY_ACTION_REMOVE,
];
