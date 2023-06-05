import { takeUntil } from 'rxjs';

import { isPrintableChar, onKeydown } from '@app/common/utils';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { ActionsMenuService } from './actions-menu.service';

export function createItemsElementController(parent: ActionsMenuService) {

  let el: HTMLElement | null;

  function init(inputEl: HTMLElement) {
    el = inputEl;
    listenToKeyboard(inputEl);
  }

  function listenToKeyboard(el: HTMLElement) {
    onKeydown(el, parent.core.destroy$, [
      {
        on: [KB.SPACE, KB.ENTER],
        handler: () => {
          parent.actions.confirmFocused();
          parent.menu.close();
          parent.focus.clear();
          parent.buttonElement.getElement()?.focus();
        },
      },
      {
        on: [KB.ESC, KB.ESCAPE],
        handler: () => {
          parent.menu.close();
          parent.focus.clear();
          parent.buttonElement.getElement()?.focus();
        },
      },
      {
        on: [KB.ARROW_UP, KB.UP],
        handler: () => parent.focus.previous(),
      },
      {
        on: [KB.ARROW_DOWN, KB.DOWN],
        handler: () => parent.focus.next(),
      },
      {
        on: [KB.HOME, KB.PAGE_UP],
        handler: () => parent.focus.first(),
      },
      {
        on: [KB.END, KB.PAGE_DOWN],
        handler: () => parent.focus.last(),
      },
      {
        on: [KB.TAB],
        handler: () => {
          parent.menu.close();
          parent.focus.clear();
          return false;
        },
      },
      {
        on: isPrintableChar,
        handler: event => parent.focus.search(event.key),
      },
    ]).pipe(takeUntil(parent.core.destroy$)).subscribe();
  }

  function getElement() {
    return el;
  }

  return { init, getElement };
};
