import { DataSource, EventSource } from '@app/common/sources';
import { ActionsMenuService } from './actions-menu.service';
import { ACTIONS_MENU_BUTTON_FOCUSED, ActionsMenuItem } from '../types';

export function createActionsController(parent: ActionsMenuService) {

  const actions$ = new DataSource<ActionsMenuItem[] | null>(null, parent.core.destroy$);
  const searchableActions$ = new DataSource<string[] | null>(null, parent.core.destroy$);
  const confirmed$ = new EventSource<ActionsMenuItem['id']>(parent.core.destroy$);

  function init(actions: ActionsMenuItem[]) {
    actions$.next(actions);
    const searchableActions: string[] = [];

    for (const action of actions) {
      searchableActions.push(action.label[0].toLowerCase());
    }

    searchableActions$.next(searchableActions);
  }

  function confirm(actionId: string) {
    confirmed$.next(actionId);
    parent.menu.close();
    parent.focus.clear();
  }

  function confirmFocused() {
    const focused = parent.focus.getFocused();
    if (focused === null || focused === ACTIONS_MENU_BUTTON_FOCUSED) return;
    confirmed$.next(focused);
  }

  return {
    actions$: actions$.data$,
    getActions: () => actions$.getCurrent(),
    getSearchableActions: () => searchableActions$.getCurrent(),
    init,
    confirmed$: confirmed$.event$,
    confirm,
    confirmFocused,
  };
}
