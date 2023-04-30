import { DataSource } from '@app/common/sources';
import { ActionsMenuService } from './actions-menu.service';

export function createIdsController(parent: ActionsMenuService) {

  const button$ = new DataSource<string | null>(null, parent.core.destroy$);
  const items$ = new DataSource<string | null>(null, parent.core.destroy$);

  const init = (id: string) => {
    button$.next(`${id}-button`);
    items$.next(`${id}-items`);
  };

  return {
    getButton: button$.getCurrent,
    button$: button$.data$,
    items$: items$.data$,
    getItems: items$.getCurrent,
    init,
  };
}
