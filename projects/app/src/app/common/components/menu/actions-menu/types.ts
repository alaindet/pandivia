import { TemplateRef } from '@angular/core';

import { TemplateImplicitContext } from '@app/common/types';

export type ActionsMenuItem = {
  id: string;
  label: string;
  icon?: string;
};

export const ACTIONS_MENU_BUTTON_FOCUSED = 'ACTIONS_MENU_BUTTON_FOCUSED';
export type ActionsMenuButtonFocused = typeof ACTIONS_MENU_BUTTON_FOCUSED;

export type ActionsMenuFocusable = ActionsMenuItem['id'] | ActionsMenuButtonFocused;

export type ActionsMenuTemplates = {
  button: TemplateRef<void> | null;
  item: TemplateRef<TemplateImplicitContext<ActionsMenuItem>> | null;
};

export type ActionsMenuViewModel = {
  templates: ActionsMenuTemplates;
  buttonId: string;
  itemsId: string;
  isOpen: boolean;
  actions: ActionsMenuItem[];
  focused: string | null;
};
