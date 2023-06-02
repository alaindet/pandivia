import { ActionsMenuItem } from '@app/common/components';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'refresh',
  label: 'Refresh', // TODO: Translate
  icon: 'refresh',
};

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  LIST_ACTION_REFRESH,
];
