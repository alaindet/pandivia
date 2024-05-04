import { signal } from '@angular/core';

import { ACTIONS_MENU_BUTTON_FOCUSED, ActionsMenuFocusable, ActionsMenuItem } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createFocusController(parent: ActionsMenuService) {

  const focused = signal<ActionsMenuFocusable | null>(null);

  function button() {
    focused.set(ACTIONS_MENU_BUTTON_FOCUSED);
  }

  function clear() {
    focused.set(null);
  }

  function first() {
    byIdWithActions(actions => actions[0].id);
  }

  function last() {
    byIdWithActions(actions => actions[actions.length - 1].id);
  }

  function previous() {
    byIdWithActions(actions => {
      const _focused = focused();

      const lastId = actions[actions.length - 1].id;
      if (!_focused || _focused === ACTIONS_MENU_BUTTON_FOCUSED) {
        return lastId;
      }

      const index = actions.findIndex(action => action.id === _focused);
      if (index === 0) {
        return lastId;
      }

      return actions[index - 1].id;
    });
  }

  function next() {
    byIdWithActions(actions => {
      const _focused = focused();

      const firstId = actions[0].id;
      if (!_focused || _focused === ACTIONS_MENU_BUTTON_FOCUSED) {
        return firstId;
      }

      const index = actions.findIndex(action => action.id === _focused);
      if (index === (actions.length - 1)) {
        return firstId;
      }

      return actions[index + 1].id;
    });
  }

  function search(letter: string) {

    const actions = parent.actions.actions();
    const searchableActions = parent.actions.searchableActions();

    if (!actions || !searchableActions) {
      return focused.set(null);
    }

    const index = searchableActions.findIndex(x => x === letter);
    focused.set(actions[index].id);
  }

  function byId(actionId: string) {
    focused.set(actionId);
  }

  function byIdWithActions(fn: (actions: ActionsMenuItem[]) => string) {
    const actions = parent.actions.actions();
    if (!actions) {
      return focused.set(null);
    }
    focused.set(fn(actions));
  }

  return {
    focused: focused.asReadonly(),
    first,
    last,
    previous,
    next,
    search,
    button,
    clear,
    byId,
  };
}
