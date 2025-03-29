import { ActionsMenuItem } from '@ui/components/actions-menu';
import { matRefresh } from '@ng-icons/material-icons/baseline';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'inventory:refresh',
  label: 'common.menu.refresh',
  icon: matRefresh,
};

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [LIST_ACTION_REFRESH];
