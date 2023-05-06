import { Observable, filter, fromEvent, takeUntil } from 'rxjs';

import { FOCUSABLE_SELECTORS } from '@app/common/utils';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { DataSource, EventSource } from '@app/common/sources';

export type ModalKeyboardController = {
  enable: () => void;
  disable: () => void;
  canceled$: Observable<void>;
};

export function createModalKeyboardController(
  element: HTMLElement,
  destroy$: Observable<void>,
): ModalKeyboardController {

  const isEnabled$ = new DataSource<boolean>(false, destroy$);
  const stop$ = new EventSource<void>(destroy$);
  const canceled$ = new EventSource<void>(destroy$);

  function enable() {
    const firstFocusable = handleFocusTrap(element);
    handleCancelByEscape(element);
    setTimeout(() => firstFocusable?.focus());
  }

  function disable() {
    isEnabled$.next(false);
    stop$.next();
  }

  function handleFocusTrap(modal: HTMLElement): HTMLElement | null {

    const focusables = element.querySelectorAll(FOCUSABLE_SELECTORS);

    if (!focusables.length) {
      disable();
      return null;
    }

    const firstFocusable = focusables.item(0) as HTMLElement;
    const lastFocusable = focusables.item(focusables.length - 1) as HTMLElement;

    onKeydown(firstFocusable)
      .pipe(filter(event => event.key === KB.TAB && event.shiftKey))
      .subscribe(event => {
        stopEvent(event);
        lastFocusable?.focus();
      });

    onKeydown(lastFocusable)
      .pipe(filter(event => event.key === KB.TAB && !event.shiftKey))
      .subscribe(event => {
        stopEvent(event);
        firstFocusable?.focus();
      });

    return firstFocusable;
  }
  
  function handleCancelByEscape(modal: HTMLElement) {
    onKeydown(modal)
      .pipe(filter(event => event.key === KB.ESC || event.key === KB.ESCAPE))
      .subscribe(event => {
        stopEvent(event);
        canceled$.next();
      });
  }

  function onKeydown(element: HTMLElement) {
    return fromEvent<KeyboardEvent>(element, 'keydown').pipe(
      takeUntil(destroy$),
      takeUntil(stop$.event$),
    );
  }

  function stopEvent(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  return {
    enable,
    disable,
    canceled$: canceled$.event$,
  };
}