import { DataSource } from '@app/common/sources';
import { ActionsMenuService } from './actions-menu.service';

export function createMenuController(parent: ActionsMenuService) {

  const open$ = new DataSource(false, parent.core.destroy$);

  function close() {
    open$.next(false);
    removeClickOut();
  }

  function globalClickHandler(event: MouseEvent) {
    const itemsElement = parent.itemsElement.getElement();
    const target = event.target as HTMLElement;

    if (itemsElement && !itemsElement.contains(target)) {
      close();
      parent.focus.button();
      removeClickOut();
    }
  }

  function open() {
    open$.next(true);
    setTimeout(() => addClickOut());
  }

  function toggle() {
    open$.getCurrent() ? close() : open();
  }

  parent.core.destroy$.subscribe(() => removeClickOut());

  function addClickOut() {
    window.addEventListener('click', globalClickHandler);
  }

  function removeClickOut() {
    window.removeEventListener('click', globalClickHandler)
  }

  return {
    open$: open$.data$,
    toggle,
    open,
    close,
  };
}
