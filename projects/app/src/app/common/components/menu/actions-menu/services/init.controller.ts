import { createWaitGroup } from '@app/common/sources/wait-group';
import { ActionsMenuService } from './actions-menu.service';
import { ActionsMenuItem } from '../types';

export function createInitController(parent: ActionsMenuService) {
  const wg = createWaitGroup({
    workers: 2,
    done: () => parent.core.ready(),
  });

  const id = (id: string) => {
    parent.ids.init(id);
    wg.done();
  };

  const actions = (actions: ActionsMenuItem[]) => {
    parent.actions.init(actions);
    wg.done();
  };

  const buttonElement = (el: HTMLButtonElement) => {
    parent.buttonElement.init(el);
  };

  const itemsElement = (el: HTMLElement) => {
    parent.itemsElement.init(el);
  };

  return { id, actions, buttonElement, itemsElement };
}
