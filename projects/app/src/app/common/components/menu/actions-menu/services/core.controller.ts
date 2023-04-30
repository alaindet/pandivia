import { OnceSource, EventSource } from '@app/common/sources';
import { ActionsMenuService } from './actions-menu.service';

export function createCoreController(parent: ActionsMenuService) {

  const destroy$ = new OnceSource();
  const ready$ = new EventSource<void>(destroy$.event$);

  function ready() {
    ready$.next();
  }

  function destructor() {
    destroy$.trigger();
  }

  return {
    destroy$: destroy$.event$,
    ready$: ready$.event$,
    destructor,
    ready,
  };
}
