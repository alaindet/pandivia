import { signal } from '@angular/core';

import { ActionsMenuService } from './actions-menu.service';

export function createMenuController(parent: ActionsMenuService) {

  const isOpen = signal(false);

  function close() {
    isOpen.set(false);
    removeClickOut();
  }

  function globalClickHandler(event: MouseEvent) {
    const itemsElement = parent.itemsElement.el();
    const target = event.target as HTMLElement;

    if (itemsElement && !itemsElement.contains(target)) {
      close();
      parent.focus.button();
      removeClickOut();
    }
  }

  function open() {
    isOpen.set(true);
    setTimeout(() => addClickOut());
  }

  function toggle() {
    isOpen() ? close() : open();
  }

  function addClickOut() {
    window.addEventListener('click', globalClickHandler);
  }

  function removeClickOut() {
    window.removeEventListener('click', globalClickHandler)
  }

  function destroy() {
    removeClickOut();
  }

  return {
    isOpen: isOpen.asReadonly(),
    toggle,
    open,
    close,
    destroy,
  };
}
