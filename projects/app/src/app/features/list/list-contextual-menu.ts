import { ActionsMenuItem } from '@app/common/components';

export const LIST_REFRESH_ACTION: ActionsMenuItem = {
  id: 'refresh',
  label: 'Refresh', // TODO: Translate
  icon: 'refresh',
};

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  LIST_REFRESH_ACTION,
];
