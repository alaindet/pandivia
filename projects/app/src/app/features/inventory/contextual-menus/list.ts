import { ActionsMenuItem } from '@app/common/components';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'inventory:refresh',
  label: 'common.menu.refresh',
  icon: 'refresh',
};

// export const LIST_ACTION_REMOVE: ActionsMenuItem = {
//   id: 'inventory:remove',
//   label: 'common.menu.removeAllItems',
//   icon: 'delete',
// };

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  LIST_ACTION_REFRESH,
  // LIST_ACTION_REMOVE,
];
