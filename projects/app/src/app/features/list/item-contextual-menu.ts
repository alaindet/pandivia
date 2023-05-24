import { ActionsMenuItem } from '@app/common/components';

export const ITEM_DELETE_ACTION: ActionsMenuItem = {
  id: 'delete',
  label: 'Delete', // TODO: Translate
  icon: 'delete',
};

export const ITEM_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  ITEM_DELETE_ACTION,
];
