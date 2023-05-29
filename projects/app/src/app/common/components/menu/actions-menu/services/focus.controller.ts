import { DataSource } from '@app/common/sources';
import { ActionsMenuService } from './actions-menu.service';
import { ACTIONS_MENU_BUTTON_FOCUSED, ActionsMenuFocusable, ActionsMenuItem } from '../types';

export function createFocusController(parent: ActionsMenuService) {

  const focused$ = new DataSource<ActionsMenuFocusable | null>(null, parent.core.destroy$);
  let actions: ActionsMenuItem[] | null = null;
  let searchableActions: string[] | null = null;

  function init() {
    parent.actions.actions$.subscribe(x => actions = x);
    parent.actions.searchableActions$.subscribe(x => searchableActions = x);
  }

  function button() {
    focused$.next(ACTIONS_MENU_BUTTON_FOCUSED);
  }

  function clear() {
    focused$.next(null);
  }

  function first() {
    byIdWithActions(actions => actions[0].id);
  }

  function last() {
    byIdWithActions(actions => actions[actions.length - 1].id);
  }

  function previous() {
    byIdWithActions(actions => {
      const focused = focused$.getCurrent();
      const lastId = actions[actions.length - 1].id;
      if (!focused || focused === ACTIONS_MENU_BUTTON_FOCUSED) return lastId;
      const index = actions.findIndex(action => action.id === focused);
      if (index === 0) return lastId;
      return actions[index - 1].id;
    });
  }

  function next() {
    byIdWithActions(actions => {
      const focused = focused$.getCurrent();
      const firstId = actions[0].id;
      if (!focused || focused === ACTIONS_MENU_BUTTON_FOCUSED) return firstId;
      const index = actions.findIndex(action => action.id === focused);
      if (index === (actions.length - 1)) return firstId;
      return actions[index + 1].id;
    });
  }

  function search(letter: string) {
    if (!actions || !searchableActions) return focused$.next(null);
    const index = searchableActions.findIndex(x => x === letter);
    focused$.next(actions[index].id);
  }

  function byId(actionId: string) {
    focused$.next(actionId);
  }

  function byIdWithActions(fn: (actions: ActionsMenuItem[]) => string) {
    if (!actions) return focused$.next(null);
    focused$.next(fn(actions));
  }

  return {
    focused$: focused$.data$,
    getFocused: () => focused$.getCurrent(),
    init,
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
