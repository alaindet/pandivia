export type ActionsMenuItem = {
  id: string;
  label: string;
  icon?: string;
};

export const ACTIONS_MENU_BUTTON_FOCUSED = 'ACTIONS_MENU_BUTTON_FOCUSED';
export type ActionsMenuButtonFocused = typeof ACTIONS_MENU_BUTTON_FOCUSED;

export type ActionsMenuFocusable = ActionsMenuItem['id'] | ActionsMenuButtonFocused;
