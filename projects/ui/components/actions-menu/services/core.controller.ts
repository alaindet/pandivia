import { Subject } from 'rxjs';

import { ActionsMenuService } from './actions-menu.service';

export function createCoreController(parent: ActionsMenuService) {
  const ready$ = new Subject<void>();

  function ready() {
    ready$.next();
  }

  function destroy() {
    ready$.complete();
  }

  return {
    ready$: ready$.asObservable(),
    destroy,
    ready,
  };
}
