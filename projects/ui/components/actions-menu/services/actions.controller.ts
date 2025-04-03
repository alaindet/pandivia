import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { ActionsMenuService } from './actions-menu.service';
import { ACTIONS_MENU_BUTTON_FOCUSED, ActionsMenuItem } from '../types';

export function createActionsController(parent: ActionsMenuService) {
  const actions = signal<ActionsMenuItem[] | null>(null);
  const searchableActions = signal<string[] | null>(null);

  const confirmed$ = new Subject<ActionsMenuItem['id']>();

  function initOrUpdate(_actions: ActionsMenuItem[]) {
    actions.set(_actions);
    const _searchableActions: string[] = [];

    for (const action of _actions) {
      _searchableActions.push(action.label[0].toLowerCase());
    }

    searchableActions.set(_searchableActions);
  }

  function confirm(actionId: string) {
    confirmed$.next(actionId);
    parent.menu.close();
    parent.focus.clear();
  }

  function confirmFocused() {
    const focused = parent.focus.focused();
    if (focused === null || focused === ACTIONS_MENU_BUTTON_FOCUSED) {
      return;
    }
    confirmed$.next(focused);
  }

  function destroy() {
    confirmed$.complete();
  }

  return {
    actions: actions.asReadonly(),
    searchableActions: searchableActions.asReadonly(),
    initOrUpdate,
    confirmed: confirmed$.asObservable(),
    confirm,
    confirmFocused,
    destroy,
  };
}
