import { ActionsMenuItem } from '@app/common/components';

export const LIST_REFRESH_ACTION: ActionsMenuItem = {
  id: 'refresh',
  label: 'Refresh', // TODO: Translate
  icon: 'refresh',
};

// TODO: Dynamic?
export const LIST_SELECT_ITEMS_ACTION: ActionsMenuItem = {
  id: 'select-items',
  label: 'Select items', // TODO: Translate
  icon: 'checklist',
};

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  LIST_REFRESH_ACTION,
  LIST_SELECT_ITEMS_ACTION,
];
